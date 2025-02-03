# Standards Mobile 2025

## Texte principal

```jsx
// Titre
className =
	"text-2xl font-medium leading-tight tracking-tight md:tracking-normal";
// 24px, tracking serré sur mobile pour économiser l'espace

// Description
className = "text-base leading-normal md:leading-relaxed";
// 16px, leading compact sur mobile

// Contenu
className = "text-sm leading-relaxed antialiased";
// 14px, antialiased pour meilleure lisibilité écrans mobiles
```

## Badges et étiquettes

```jsx
className =
	"text-sm px-2 py-1 rounded-md inline-flex items-center touch-target-2025";
// touch-target-2025 assure zone de touch minimale 44px (norme iOS)
```

## Icônes

```jsx
// Optimisation densité pixels écrans mobiles
className = "h-5 w-5 transform-gpu";
// transform-gpu pour animations fluides
```

## Espacements

```jsx
// Conteneurs avec safe-area
className = "p-4 safe-area-x safe-area-bottom space-y-4";

// Espacement adaptatif
className = "gap-4 sm:gap-6";

// Espacement compact mobile
className = "space-y-2 sm:space-y-3 safe-area-x";
```

## Exemple Card Optimisée Mobile

```jsx
<div className="p-4 space-y-4 safe-area-x overflow-hidden touch-action-pan-y">
	<h2 className="text-2xl font-medium leading-tight tracking-tight md:tracking-normal">
		Titre
	</h2>
	<p className="text-base leading-normal md:leading-relaxed antialiased">
		Description
	</p>
	<div className="text-sm leading-relaxed antialiased">Contenu</div>
	<div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x">
		<span className="text-sm px-2 py-1 rounded-md inline-flex items-center touch-target-2025 snap-start">
			Badge
		</span>
		<Icon className="h-5 w-5 transform-gpu" />
	</div>
</div>
```

## Optimisations Mobiles Spécifiques

1. `safe-area-x` et `safe-area-bottom`

   - Respect des zones sécurisées (notch, dynamic island)
   - Adaptation aux différents appareils

2. `antialiased`

   - Meilleur rendu du texte
   - Optimisé écrans haute densité

3. `touch-action-pan-y`

   - Optimisation scroll vertical
   - Meilleures performances tactiles

4. `transform-gpu`

   - Utilisation du GPU pour animations
   - Fluidité accrue

5. `hide-scrollbar`

   - Cache barres défilement
   - Garde fonctionnalité scroll

6. `snap-x` et `snap-start`

   - Défilement fluide listes horizontales
   - Expérience tactile améliorée

7. `tracking-tight` sur mobile

   - Meilleure utilisation espace horizontal
   - Adapté aux petits écrans

8. Zones touch minimales 44px
   - Norme iOS
   - Accessibilité optimale

## Standards Respectés

- ✅ Performance mobile optimale
- ✅ Compatibilité appareils modernes
- ✅ Expérience tactile optimisée
- ✅ Lisibilité écrans haute densité
- ✅ Utilisation efficace espace
- ✅ Normes accessibilité WCAG 2.2
- ✅ Standards Material Design 3
- ✅ Guidelines iOS HIG
- ✅ Compatibilité gestes mobiles
