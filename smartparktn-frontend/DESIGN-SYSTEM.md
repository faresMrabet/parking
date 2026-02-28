# 🎨 SmartParkTN - Système de Design

## Palette de Couleurs

### Couleurs Principales
```scss
--primary-dark: #30364F    // Navbar, headers, texte principal
--secondary: #ACBAC4       // Boutons secondaires, hover
--accent: #E1D9BC          // CTA, highlights, accents
--background: #F0F0DB      // Fond général, panels
```

### Couleurs Fonctionnelles
```scss
--white: #FFFFFF           // Cartes, conteneurs
--success: #4CAF50         // Succès, validations
--warning: #FF9800         // Avertissements
--error: #F44336           // Erreurs, refus
--text-primary: #30364F    // Texte principal
--text-secondary: #6B7280  // Texte secondaire
```

## Typographie

### Hiérarchie
- **H1**: 36px, font-weight: 700 (Titres de pages)
- **H2**: 28px, font-weight: 600 (Sections)
- **H3**: 24px, font-weight: 600 (Sous-sections)
- **Body**: 16px, line-height: 1.6
- **Small**: 14px (Labels, détails)

### Police
- Famille: 'Roboto', 'Segoe UI', sans-serif
- Poids disponibles: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

## Espacements

### Padding/Margin
- **xs**: 8px
- **sm**: 16px
- **md**: 24px
- **lg**: 32px
- **xl**: 48px

### Gap (Grilles)
- Standard: 24px
- Compact: 16px
- Large: 32px

## Border Radius

### Composants
- **Boutons**: 12px
- **Cards**: 16-20px
- **Inputs**: 12px
- **Chips/Badges**: 20px (pill)
- **Modal**: 16px

## Ombres

### Niveaux
```scss
--shadow: 0 4px 12px rgba(48, 54, 79, 0.1)
--shadow-hover: 0 8px 24px rgba(48, 54, 79, 0.2)
--shadow-sm: 0 2px 8px rgba(48, 54, 79, 0.1)
--shadow-lg: 0 12px 32px rgba(48, 54, 79, 0.2)
```

## Animations

### Durées
- **Fast**: 0.2s (hover, focus)
- **Normal**: 0.3s (transitions standard)
- **Slow**: 0.5s (entrées de page)

### Easing
- **Standard**: ease
- **Smooth**: cubic-bezier(0.4, 0, 0.2, 1)
- **Bounce**: cubic-bezier(0.68, -0.55, 0.265, 1.55)

### Animations Prédéfinies
```scss
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}
```

## Composants

### Boutons

#### Primary
```scss
background: linear-gradient(135deg, #30364F 0%, #4A5270 100%);
color: white;
padding: 12px 24px;
border-radius: 12px;
```

#### Accent
```scss
background: linear-gradient(135deg, #E1D9BC 0%, #D4C9A8 100%);
color: #30364F;
```

#### Secondary
```scss
background: linear-gradient(135deg, #ACBAC4 0%, #9BAAB4 100%);
color: white;
```

### Cards

#### Standard
```scss
background: white;
border-radius: 16px;
box-shadow: 0 4px 12px rgba(48, 54, 79, 0.1);
padding: 24px;
```

#### Hover Effect
```scss
&:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(48, 54, 79, 0.2);
}
```

#### Gradient
```scss
background: linear-gradient(135deg, white 0%, #F0F0DB 100%);
```

### Badges/Chips

#### Success
```scss
background: #4CAF50;
color: white;
padding: 6px 12px;
border-radius: 20px;
```

#### Warning
```scss
background: #FF9800;
color: white;
```

#### Error
```scss
background: #F44336;
color: white;
```

## Grilles Responsive

### Breakpoints
```scss
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

### Grid System
```scss
.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### Responsive Behavior
- **Desktop**: 4 colonnes → 3 colonnes
- **Tablet**: 3 colonnes → 2 colonnes
- **Mobile**: Toutes → 1 colonne

## États Interactifs

### Hover
```scss
transition: all 0.3s ease;
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(48, 54, 79, 0.2);
}
```

### Focus
```scss
outline: 2px solid #E1D9BC;
outline-offset: 2px;
```

### Active
```scss
transform: scale(0.98);
```

### Disabled
```scss
opacity: 0.5;
cursor: not-allowed;
```

## Icônes

### Tailles
- **Small**: 16px
- **Medium**: 20px (navigation)
- **Large**: 24px (actions)
- **XLarge**: 32-40px (headers)
- **Hero**: 64-80px (empty states)

### Couleurs
- Primary actions: `var(--primary-dark)`
- Success: `var(--success)`
- Warning: `var(--warning)`
- Error: `var(--error)`
- Neutral: `var(--secondary)`

## Navigation

### Navbar
```scss
background: linear-gradient(135deg, #30364F 0%, #4A5270 100%);
height: 80px;
position: sticky;
top: 0;
z-index: 1000;
```

### Nav Items
```scss
// Normal
color: rgba(255, 255, 255, 0.8);

// Hover
background: rgba(255, 255, 255, 0.1);
color: white;

// Active
background: #E1D9BC;
color: #30364F;
```

## Formulaires

### Input Fields
```scss
border-radius: 12px;
padding: 12px 16px;
border: 1px solid #ACBAC4;
background: white;

&:focus {
  border-color: #E1D9BC;
  box-shadow: 0 0 0 3px rgba(225, 217, 188, 0.2);
}
```

### Labels
```scss
font-size: 14px;
font-weight: 600;
color: #30364F;
margin-bottom: 8px;
```

## Tables

### Header
```scss
background: linear-gradient(135deg, #30364F 0%, #4A5270 100%);
color: white;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 1px;
```

### Rows
```scss
&:hover {
  background: rgba(225, 217, 188, 0.1);
  transform: scale(1.01);
}
```

## Modals/Dialogs

### Container
```scss
border-radius: 16px;
padding: 32px;
max-width: 600px;
box-shadow: 0 12px 32px rgba(48, 54, 79, 0.3);
```

### Overlay
```scss
background: rgba(48, 54, 79, 0.8);
backdrop-filter: blur(4px);
```

## Loading States

### Spinner
```scss
color: #30364F;
size: 40-60px;
```

### Skeleton
```scss
background: linear-gradient(90deg, #F0F0DB 0%, #E1D9BC 50%, #F0F0DB 100%);
animation: shimmer 1.5s infinite;
```

## Empty States

### Container
```scss
padding: 80px;
text-align: center;
color: #6B7280;
```

### Icon
```scss
font-size: 80px;
color: #ACBAC4;
opacity: 0.5;
margin-bottom: 24px;
```

## Accessibilité

### Contraste
- Texte sur fond clair: ratio minimum 4.5:1
- Texte large sur fond clair: ratio minimum 3:1
- Éléments interactifs: ratio minimum 3:1

### Focus Visible
Tous les éléments interactifs doivent avoir un état focus visible avec `outline: 2px solid #E1D9BC`

### Tailles Tactiles
Minimum 44x44px pour les éléments interactifs sur mobile

## Utilisation

### Classes Utilitaires
```html
<!-- Marges -->
<div class="mt-2 mb-3">...</div>

<!-- Padding -->
<div class="p-3">...</div>

<!-- Arrondi -->
<div class="rounded-lg">...</div>

<!-- Ombres -->
<div class="shadow-lg">...</div>

<!-- Grilles -->
<div class="grid grid-cols-3">...</div>

<!-- Animations -->
<div class="fade-in">...</div>
```

### Composants Material
Tous les composants Material Design sont personnalisés avec le thème SmartParkTN via les overrides dans `styles.scss`

## Bonnes Pratiques

1. **Cohérence**: Utiliser les variables CSS pour toutes les couleurs
2. **Performance**: Limiter les animations à `transform` et `opacity`
3. **Responsive**: Mobile-first approach
4. **Accessibilité**: Toujours tester avec un lecteur d'écran
5. **Maintenance**: Documenter les modifications du design system

## Ressources

- Palette de couleurs: [Coolors](https://coolors.co/)
- Icônes: Material Icons
- Polices: Google Fonts (Roboto)
- Inspiration: Material Design 3

---

**Version**: 1.0.0  
**Dernière mise à jour**: Février 2026  
**Maintenu par**: Équipe SmartParkTN
