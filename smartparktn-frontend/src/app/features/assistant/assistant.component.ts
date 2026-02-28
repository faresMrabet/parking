import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { AssistantService, Message, AssistantResponse } from '../../core/services/assistant.service';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  suggestedQuestions: string[] = [
    "Quelles sont les règles de tarification ?",
    "Combien de véhicules sont dans le parking ?",
    "Pourquoi un véhicule est refusé ?",
    "Donne-moi des recommandations",
    "Quelle est la règle pour les VIP ?"
  ];

  private shouldScrollToBottom = false;

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    // Message de bienvenue
    this.addMessage({
      id: this.generateId(),
      text: "Bonjour ! Je suis votre assistant intelligent SmartParkTN. 🤖\n\n" +
            "Je peux vous aider à :\n" +
            "• Comprendre les règles de tarification\n" +
            "• Analyser les statistiques du parking\n" +
            "• Obtenir des informations sur un véhicule\n" +
            "• Gérer les blacklists\n" +
            "• Recevoir des recommandations\n\n" +
            "Posez-moi une question ou cliquez sur une suggestion ci-dessous !",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const userMessage: Message = {
      id: this.generateId(),
      text: this.userInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    this.addMessage(userMessage);
    const question = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    // Traiter la question
    this.assistantService.processQuestion(question).subscribe({
      next: (response: AssistantResponse) => {
        const assistantMessage: Message = {
          id: this.generateId(),
          text: response.message,
          sender: 'assistant',
          timestamp: new Date(),
          type: response.type,
          data: response.data
        };
        this.addMessage(assistantMessage);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error processing question:', error);
        const errorMessage: Message = {
          id: this.generateId(),
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          sender: 'assistant',
          timestamp: new Date(),
          type: 'text'
        };
        this.addMessage(errorMessage);
        this.isLoading = false;
      }
    });
  }

  useSuggestedQuestion(question: string): void {
    this.userInput = question;
    this.sendMessage();
  }

  clearChat(): void {
    this.messages = [];
    this.ngOnInit();
  }

  private addMessage(message: Message): void {
    this.messages.push(message);
    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
