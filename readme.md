# 𝐵𝑙𝑖𝑛𝑑𝑡𝑒𝑠𝑡 𝑑𝑒𝑠 𝐼𝑛𝑡𝑟𝑜𝑠

Testez vos connaissances sur les plus belles intros musicales (liste non-exhaustive) !!

---

## ↬ Règles du jeu

L'objectif est simple : **devinez chaque chanson** en écoutant son introduction, sans voir le titre ni l'artiste.

### ↬ 4 niveaux de difficulté

| Niveau | Durée | Points | Difficulté |
|--------|-------|--------|-----------|
| Hardcore | 0.4 seconde | **+4 pts** | ⭐⭐⭐⭐⭐ |
| Boss | 3 secondes | **+3 pts** | ⭐⭐⭐⭐ |
| Medium | 5 secondes | **+2 pts** | ⭐⭐⭐ |
| Noob | Intro complète | **+1 pt** | ⭐ |

Plus difficile est le niveau, plus vous gagnez de points !

---

## ↬ Fonctionnalités

✓ **55 chansons** rock / funk / pop  
✓ **Égalisation du volume** : Volume standardisé entre toutes les chansons  
✓ **Navigation facile** : Allez à la question précédente/suivante  
✓ **Révélation** : Découvrez la réponse avec un extrait du refrain  
✓ **Responsive** : Jouable sur tous les appareils (phone / desktop)

---

## ↬ Structure du projet

```
BLINDTEST/
├── index.html         # Page d'accueil avec les règles
├── question.html      # Page avec le lecteur audio et les réponses
├── app.js            # Logique du jeu (lecteur, navigation, points)
├── data.js           # Base de données avec les 55 chansons
├── style.css         # Styles (design, animations, couleurs)
├── audio/            # Dossier contenant tous les fichiers MP3
└── readme.md         # Ce fichier
```

---

## ↬ Fichiers clés

### `data.js`
Contient la liste de toutes les chansons avec :
- **title** : Titre de la chanson
- **artist** : Artiste
- **file** : Chemin du fichier audio
- **introEnd** : Durée de l'intro complète (niveau Noob)
- **chorusStart** : Position du refrain (en secondes)
- **revealDuration** : Durée du refrain joué à la révélation
- **gain** : Multiplicateur de volume pour l'égalisation

### `app.js`
Gère :
- La lecture audio avec Web Audio API
- L'égalisation du volume
- La navigation entre les questions
- L'affichage de la progression
- La révélation des réponses

---

## ↬ Comment utiliser

1. **Ouvrez ce [lien](https://4daile.github.io/BLINDTEST/)** 
2. **Cliquez sur "Play"** pour commencer le blind test
4. **Écoutez l'introduction** et essayez de deviner, changez les difficultés
5. **Cliquez sur l'œil** pour révéler la réponse et entendre le refrain
6. **Naviguez** avec les boutons Précédent/Suivant

---

## ↬ Configuration des chansons

Pour ajouter une nouvelle chanson à `data.js` :

```javascript
{
  id: 56,
  title: 'Nom de la chanson',
  artist: 'Artiste',
  file: 'audio/NOM_FICHIER.mp3',
  introEnd: 30,           // durée intro en secondes
  chorusStart: 120,       // position du refrain
  revealDuration: 8,      // durée du clip de révélation
  gain: 0.5              // volume (à ajuster selon le fichier)
}
```

---

## ↬ Égalisation du volume

Le jeu utilise la **Web Audio API** pour normaliser le volume entre toutes les chansons :
- Chaque chanson a un coefficient `gain` calculé selon sa dynamique LUFS
- Un volume global `GLOBAL_VOLUME` permet d'ajuster le volume général
- Le rapport entre les chansons reste toujours équilibré

---

## ↬ Personnalisation

- **Couleurs** : Modifiez les variables CSS dans `style.css` (--pink, --purple, --blue, --green)
- **Volume global** : Changez `GLOBAL_VOLUME` dans `app.js` (0.2 par défaut)
- **Chansons** : Éditez la liste dans `data.js`

---

## ↬ Navigateurs supportés

- Chrome/Edge (57+)
- Firefox (25+)
- Safari (14.1+)
- Opera (44+)

*Nécessite la Web Audio API pour l'égalisation du volume*

---

## ↬ Notes

- Les fichiers audio doivent être en MP3 et placés dans le dossier `audio/`
- Les durées et positions (`introEnd`, `chorusStart`, etc.) doivent être en secondes
- Le projet est en français mais facilement adaptable à d'autres langues

--- 

N'hésitez pas à reprendre ce code pour concocter votre propre blindtest ! 

