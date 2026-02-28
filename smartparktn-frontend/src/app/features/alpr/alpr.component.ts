import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ParkingService, EntryResponse, ExitResponse } from '../../core/services/parking.service';
import { AlprService } from '../../core/services/alpr.service';

type OperationMode = 'simulation' | 'camera';
type OperationType = 'entry' | 'exit';

interface OperationResult {
  success: boolean;
  type: OperationType;
  plateNumber: string;
  message: string;
  data?: any;
  timestamp: Date;
  confidence?: number;
  vehicleCategory?: 'VIP' | 'Abonné' | 'Visiteur' | 'Blacklist';
}

@Component({
  selector: 'app-alpr',
  templateUrl: './alpr.component.html',
  styleUrls: ['./alpr.component.scss']
})
export class AlprComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  // Caméra
  cameraActive = false;
  cameraAvailable = false;
  
  // État
  loading = false;
  loadingMessage = 'Traitement en cours...';
  result: OperationResult | null = null;
  recognitionError: string | null = null;
  recognitionConfidence: number | null = null;
  detectedPlate: string = '';
  
  // Historique des opérations
  recentOperations: OperationResult[] = [];

  constructor(
    private parkingService: ParkingService,
    private alprService: AlprService,
    private snackBar: MatSnackBar
  ) { }

  async ngOnInit(): Promise<void> {
    // Vérifier si la caméra est disponible
    this.cameraAvailable = await this.alprService.isCameraAvailable();
    
    if (this.cameraAvailable) {
      // Activer la caméra automatiquement
      await this.startCamera();
    } else {
      this.snackBar.open('⚠️ Caméra non disponible', 'Fermer', { duration: 5000 });
    }
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  /**
   * Démarre la caméra
   */
  async startCamera(): Promise<void> {
    try {
      this.loading = true;
      this.loadingMessage = '📸 Activation de la caméra...';
      await this.alprService.initCamera(this.videoElement.nativeElement);
      this.cameraActive = true;
      this.snackBar.open('✅ Caméra activée', 'Fermer', { duration: 2000 });
    } catch (error) {
      this.snackBar.open('❌ Erreur d\'activation de la caméra', 'Fermer', { duration: 3000 });
      console.error('Erreur caméra:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Arrête la caméra
   */
  stopCamera(): void {
    this.alprService.stopCamera();
    this.cameraActive = false;
  }

  /**
   * Capture et reconnaît une plaque
   */
  async captureAndRecognize(): Promise<void> {
    if (!this.cameraActive) {
      this.snackBar.open('⚠️ Veuillez activer la caméra', 'Fermer', { duration: 3000 });
      return;
    }

    try {
      this.loading = true;
      this.loadingMessage = '📸 Capture de l\'image...';
      this.recognitionError = null;
      this.recognitionConfidence = null;
      this.detectedPlate = '';
      
      // Capturer l'image
      const imageData = this.alprService.captureImage();
      if (!imageData) {
        throw new Error('Impossible de capturer l\'image');
      }

      this.loadingMessage = '🔍 Reconnaissance en cours...';

      // Envoyer à l'API de reconnaissance
      const recognition = await this.alprService.sendToRecognitionAPI(imageData);
      
      // Afficher le résultat
      this.detectedPlate = recognition.plateNumber;
      this.recognitionConfidence = recognition.confidence;
      
      const confidencePercent = (recognition.confidence * 100).toFixed(1);
      this.snackBar.open(
        `✅ Plaque détectée: ${recognition.plateNumber} (${confidencePercent}%)`, 
        'Fermer', 
        { duration: 4000 }
      );
      
      console.log('✅ Reconnaissance réussie:', recognition);
      
      // Enregistrer automatiquement l'entrée
      await this.registerEntry();
      
    } catch (error: any) {
      console.error('❌ Erreur reconnaissance:', error);
      
      // Gérer les différents types d'erreurs
      if (error.code === 'NO_PLATE_DETECTED') {
        this.recognitionError = 'Aucune plaque détectée. Rapprochez la caméra et réessayez.';
        this.snackBar.open('🚫 Aucune plaque détectée', 'Fermer', { duration: 4000 });
      } else if (error.code === 'LOW_CONFIDENCE') {
        this.recognitionError = `${error.message}. Améliorez l'éclairage et réessayez.`;
        this.snackBar.open('⚠️ Confiance trop faible', 'Fermer', { duration: 4000 });
      } else if (error.code === 'API_ERROR') {
        this.recognitionError = 'Erreur API. Vérifiez votre clé API et votre connexion.';
        this.snackBar.open('❌ Erreur API', 'Fermer', { duration: 4000 });
      } else if (error.code === 'NETWORK_ERROR') {
        this.recognitionError = 'Erreur de connexion. Vérifiez que le backend est démarré.';
        this.snackBar.open('🌐 Erreur de connexion', 'Fermer', { duration: 4000 });
      } else {
        this.recognitionError = 'Erreur de reconnaissance. Réessayez.';
        this.snackBar.open('⚠️ Erreur de reconnaissance', 'Fermer', { duration: 3000 });
      }
    } finally {
      this.loading = false;
      this.loadingMessage = 'Traitement en cours...';
    }
  }

  /**
   * Enregistre une entrée
   */
  private async registerEntry(): Promise<void> {
    if (!this.detectedPlate) {
      return;
    }

    this.loading = true;
    this.loadingMessage = '📝 Enregistrement de l\'entrée...';
    
    this.parkingService.registerEntry({ plateNumber: this.detectedPlate.toUpperCase() })
      .subscribe({
        next: (response: EntryResponse) => {
          this.handleEntrySuccess(response);
        },
        error: (error) => {
          this.handleError(error, 'entry');
        }
      });
  }

  /**
   * Gère le succès d'une entrée
   */
  private handleEntrySuccess(response: EntryResponse): void {
    this.loading = false;
    
    // Déterminer la catégorie du véhicule
    let vehicleCategory: 'VIP' | 'Abonné' | 'Visiteur' | 'Blacklist' = 'Visiteur';
    if (response.vehicleType) {
      if (response.vehicleType === 'VIP') vehicleCategory = 'VIP';
      else if (response.vehicleType === 'Abonné') vehicleCategory = 'Abonné';
      else if (response.vehicleType === 'Visiteur') vehicleCategory = 'Visiteur';
    }
    if (response.status === 'refused') vehicleCategory = 'Blacklist';
    
    const result: OperationResult = {
      success: response.status === 'authorized',
      type: 'entry',
      plateNumber: response.plateNumber,
      message: response.status === 'authorized' 
        ? '✅ Entrée enregistrée avec succès' 
        : `🚫 ${response.reason || 'Accès refusé'}`,
      data: response,
      timestamp: new Date(),
      confidence: this.recognitionConfidence || undefined,
      vehicleCategory: vehicleCategory
    };

    this.result = result;
    this.recentOperations.unshift(result);
    if (this.recentOperations.length > 5) {
      this.recentOperations.pop();
    }

    if (response.status === 'authorized') {
      this.snackBar.open('✅ Entrée enregistrée', 'Fermer', { duration: 3000 });
    } else {
      this.snackBar.open('🚫 Accès refusé', 'Fermer', { duration: 3000 });
    }
    
    // Réinitialiser la confidence après utilisation
    this.recognitionConfidence = null;
  }

  /**
   * Gère le succès d'une sortie
   */
  private handleExitSuccess(response: ExitResponse): void {
    this.loading = false;
    
    const result: OperationResult = {
      success: true,
      type: 'exit',
      plateNumber: response.plateNumber,
      message: '✅ Sortie enregistrée avec succès',
      data: response,
      timestamp: new Date(),
      confidence: this.recognitionConfidence || undefined
    };

    this.result = result;
    this.recentOperations.unshift(result);
    if (this.recentOperations.length > 5) {
      this.recentOperations.pop();
    }

    this.snackBar.open('✅ Sortie enregistrée', 'Fermer', { duration: 3000 });
    
    // Réinitialiser la confidence après utilisation
    this.recognitionConfidence = null;
  }

  /**
   * Gère les erreurs
   */
  private handleError(error: any, type: OperationType): void {
    this.loading = false;
    
    const errorMessage = error.error?.error || 'Erreur de connexion au serveur';
    
    const result: OperationResult = {
      success: false,
      type,
      plateNumber: this.detectedPlate.toUpperCase(),
      message: errorMessage,
      timestamp: new Date()
    };

    this.result = result;
    this.snackBar.open(`❌ ${errorMessage}`, 'Fermer', { duration: 4000 });
  }

  /**
   * Réinitialise le résultat
   */
  clearResult(): void {
    this.result = null;
  }

  /**
   * Formate la date
   */
  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString('fr-FR');
  }

  /**
   * Formate la durée
   */
  formatDuration(duration: number): string {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Retourne la couleur du badge selon la catégorie
   */
  getCategoryColor(category?: string): string {
    switch (category) {
      case 'VIP': return 'primary';
      case 'Abonné': return 'accent';
      case 'Visiteur': return 'warn';
      case 'Blacklist': return 'warn';
      default: return 'primary';
    }
  }

  /**
   * Retourne l'icône du badge selon la catégorie
   */
  getCategoryIcon(category?: string): string {
    switch (category) {
      case 'VIP': return 'star';
      case 'Abonné': return 'card_membership';
      case 'Visiteur': return 'person';
      case 'Blacklist': return 'block';
      default: return 'help';
    }
  }
}
