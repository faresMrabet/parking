import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CameraConfig {
  width: number;
  height: number;
  facingMode: 'user' | 'environment';
}

export interface RecognitionResult {
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  region?: string;
  vehicle?: {
    type?: string;
    color?: string;
  };
}

export interface PlateRecognizerResponse {
  results: Array<{
    plate: string;
    confidence: number;
    region?: {
      code: string;
    };
    vehicle?: {
      type: string;
      color: string;
    };
  }>;
  processing_time: number;
}

export interface RecognitionError {
  code: string;
  message: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AlprService {
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private apiProvider: 'platerecognizer' | 'openalpr' | 'simulation' = 'simulation';

  constructor(private http: HttpClient) {
    // Déterminer le provider API disponible
    this.detectApiProvider();
  }

  /**
   * Détecte quel provider API est configuré
   */
  private detectApiProvider(): void {
    if (environment.plateRecognizerApiKey && environment.plateRecognizerApiKey !== 'YOUR_API_KEY_HERE') {
      this.apiProvider = 'platerecognizer';
      console.log('✅ Plate Recognizer API configurée');
    } else if (environment.openAlprApiKey && environment.openAlprApiKey !== 'YOUR_OPENALPR_KEY_HERE') {
      this.apiProvider = 'openalpr';
      console.log('✅ OpenALPR API configurée');
    } else {
      this.apiProvider = 'simulation';
      console.warn('⚠️ Aucune API ALPR configurée - Mode simulation activé');
    }
  }

  /**
   * Retourne le provider API actuel
   */
  getApiProvider(): string {
    return this.apiProvider;
  }

  /**
   * Initialise la webcam
   */
  async initCamera(videoElement: HTMLVideoElement, config: CameraConfig = {
    width: 1280,
    height: 720,
    facingMode: 'environment'
  }): Promise<MediaStream> {
    try {
      const constraints = {
        video: {
          width: { ideal: config.width },
          height: { ideal: config.height },
          facingMode: config.facingMode
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      
      return this.stream;
    } catch (error) {
      console.error('Erreur initialisation caméra:', error);
      throw new Error('Impossible d\'accéder à la caméra');
    }
  }

  /**
   * Arrête la webcam
   */
  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Capture une image depuis la vidéo
   */
  captureImage(): string | null {
    if (!this.videoElement) {
      return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', environment.alprConfig.captureQuality);
  }

  /**
   * Convertit base64 en Blob pour l'upload
   */
  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Envoie l'image à Plate Recognizer API
   */
  private async recognizeWithPlateRecognizer(imageData: string): Promise<RecognitionResult> {
    const blob = this.dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append('upload', blob, 'capture.jpg');
    formData.append('regions', environment.alprConfig.regions.join(','));

    const headers = new HttpHeaders({
      'Authorization': `Token ${environment.plateRecognizerApiKey}`
    });

    try {
      const response = await this.http.post<PlateRecognizerResponse>(
        environment.plateRecognizerApiUrl,
        formData,
        { headers }
      ).pipe(
        retry(environment.alprConfig.maxRetries),
        catchError(error => {
          console.error('Erreur Plate Recognizer API:', error);
          throw {
            code: 'API_ERROR',
            message: 'Erreur lors de la reconnaissance de plaque',
            details: error
          };
        })
      ).toPromise();

      if (!response || !response.results || response.results.length === 0) {
        throw {
          code: 'NO_PLATE_DETECTED',
          message: 'Aucune plaque détectée dans l\'image',
          details: null
        };
      }

      const result = response.results[0];
      
      if (result.confidence < environment.alprConfig.minConfidence) {
        throw {
          code: 'LOW_CONFIDENCE',
          message: `Confiance trop faible: ${(result.confidence * 100).toFixed(1)}%`,
          details: { confidence: result.confidence }
        };
      }

      return {
        plateNumber: result.plate.toUpperCase(),
        confidence: result.confidence,
        timestamp: new Date(),
        region: result.region?.code,
        vehicle: result.vehicle
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Envoie l'image à OpenALPR API
   */
  private async recognizeWithOpenALPR(imageData: string): Promise<RecognitionResult> {
    const blob = this.dataURLtoBlob(imageData);
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');
    formData.append('secret_key', environment.openAlprApiKey);
    formData.append('country', 'tn');

    try {
      const response: any = await this.http.post(
        environment.openAlprApiUrl,
        formData
      ).pipe(
        retry(environment.alprConfig.maxRetries),
        catchError(error => {
          console.error('Erreur OpenALPR API:', error);
          throw {
            code: 'API_ERROR',
            message: 'Erreur lors de la reconnaissance de plaque',
            details: error
          };
        })
      ).toPromise();

      if (!response || !response.results || response.results.length === 0) {
        throw {
          code: 'NO_PLATE_DETECTED',
          message: 'Aucune plaque détectée dans l\'image',
          details: null
        };
      }

      const result = response.results[0];
      const confidence = result.confidence / 100; // OpenALPR retourne 0-100

      if (confidence < environment.alprConfig.minConfidence) {
        throw {
          code: 'LOW_CONFIDENCE',
          message: `Confiance trop faible: ${(confidence * 100).toFixed(1)}%`,
          details: { confidence }
        };
      }

      return {
        plateNumber: result.plate.toUpperCase(),
        confidence: confidence,
        timestamp: new Date(),
        region: result.region
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Simulation de reconnaissance (mode développement)
   */
  private async recognizeWithSimulation(imageData: string): Promise<RecognitionResult> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simuler différents scénarios
        const scenarios = [
          { plateNumber: '123TUN4567', confidence: 0.95 },
          { plateNumber: '456TUN7890', confidence: 0.88 },
          { plateNumber: '789TUN1234', confidence: 0.92 },
          { plateNumber: '999TUN9999', confidence: 0.85 },
          { plateNumber: '111TUN2222', confidence: 0.78 }
        ];

        const random = Math.random();
        
        // 10% de chance d'échec
        if (random < 0.1) {
          reject({
            code: 'NO_PLATE_DETECTED',
            message: 'Aucune plaque détectée (simulation)',
            details: null
          });
          return;
        }

        // 5% de chance de confiance faible
        if (random < 0.15) {
          reject({
            code: 'LOW_CONFIDENCE',
            message: 'Confiance trop faible: 65%',
            details: { confidence: 0.65 }
          });
          return;
        }

        // Sélectionner un scénario aléatoire
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        resolve({
          plateNumber: scenario.plateNumber,
          confidence: scenario.confidence,
          timestamp: new Date(),
          region: 'TN',
          vehicle: {
            type: 'Sedan',
            color: 'White'
          }
        });
      }, 1500); // Simuler un délai réseau
    });
  }

  /**
   * Envoie l'image au backend pour reconnaissance
   */
  async sendToRecognitionAPI(imageData: string): Promise<RecognitionResult> {
    console.log(`🔍 Envoi de l'image au backend pour reconnaissance...`);

    try {
      const blob = this.dataURLtoBlob(imageData);
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      const response: any = await this.http.post(
        'http://localhost:5000/api/alpr/recognize',
        formData
      ).pipe(
        catchError(error => {
          console.error('Erreur reconnaissance:', error);
          if (error.error && !error.error.success) {
            throw {
              code: 'API_ERROR',
              message: error.error.message || 'Erreur lors de la reconnaissance',
              details: error.error
            };
          }
          throw {
            code: 'NETWORK_ERROR',
            message: 'Erreur de connexion au serveur',
            details: error
          };
        })
      ).toPromise();

      if (!response.success) {
        throw {
          code: 'NO_PLATE_DETECTED',
          message: response.message || 'Aucune plaque détectée',
          details: null
        };
      }

      return {
        plateNumber: response.plateNumber,
        confidence: response.confidence,
        timestamp: new Date(),
        region: response.region,
        vehicle: response.vehicle
      };
    } catch (error: any) {
      console.error('Erreur reconnaissance:', error);
      throw error;
    }
  }

  /**
   * Vérifie si la caméra est disponible
   */
  async isCameraAvailable(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch {
      return false;
    }
  }

  /**
   * Valide le format de plaque tunisienne
   */
  validateTunisianPlate(plateNumber: string): boolean {
    const tunisianPlateRegex = /^\d{1,3}[A-Z]{2,3}\d{1,4}$/;
    return tunisianPlateRegex.test(plateNumber.toUpperCase());
  }
}
