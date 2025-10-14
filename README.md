# Flag Matcher 🌍

A fun and educational browser-based geography game where you match falling flags to their correct country names before they reach the bottom of the screen!

## 🎮 How to Play

- Flags will fall from the top of the screen
- Click the correct country name from the multiple-choice options below
- Score points for correct answers
- You have 3 lives - lose them all and it's game over!
- The game gets progressively faster as your score increases

## 🚀 Features

- **Educational**: Learn to recognize flags from around the world
- **Progressive Difficulty**: Game speed increases as you score higher
- **Clean Design**: Modern, responsive interface with smooth animations
- **No Dependencies**: Pure HTML, CSS, and JavaScript
- **Offline Capable**: All game data is loaded locally

## 🎯 Game Mechanics

- **Scoring**: +10 points per correct answer
- **Lives**: Start with 3 lives, lose one for wrong answers or missed flags
- **Difficulty**: Speed increases gradually based on score
- **Smart Answer System**: Always shows answers for the flag closest to the bottom
- **Visual Feedback**: Immediate color-coded feedback for answers

## 📊 Data Source

This game uses country data and flag SVGs from the **[flag-icons](https://github.com/lipis/flag-icons)** project by [Lipis](https://github.com/lipis).

## 🎨 Customization

### Easy Modifications:

- **Difficulty**: Adjust `baseSpeed` and `spawnRate` in `game.js`
- **Appearance**: Modify colors and styles in `style.css`

### Adding Game Modes:

The code structure makes it easy to add:

- Time attack mode
- Continent-specific challenges
- Different difficulty levels

## 🌐 Browser Compatibility

Works in modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🤝 Contributing

Feel free to fork this project and submit pull requests for:

- Bug fixes
- New features
- Improved styling
- Additional game modes

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Flag Icons**: Thanks to [Lipis](https://github.com/lipis) for the comprehensive flag SVG collection
- **Game Design**: Inspired by classic falling object arcade games
- **Educational Value**: Designed to make geography learning fun and engaging
