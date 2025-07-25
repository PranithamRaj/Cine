# CinePrompt: AI-Powered Video Prompt Generator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.1-purple.svg)](https://vitejs.dev/)

CinePrompt is a sophisticated web application designed to generate compelling and descriptive video prompts for AI video generation models. Leveraging Google's Gemini API, it synthesizes user inputs into rich, narrative prompts while optionally incorporating image analysis for enhanced context. Built with React, TypeScript, and Shadcn UI, CinePrompt offers a modern, responsive interface with dark mode support and advanced customization options.

## Features

- **Intuitive Prompt Generation**: Create detailed video prompts by specifying concepts, styles, camera settings, pacing, special effects, and more.
- **Image Upload and Analysis**: Upload up to 10 images to provide visual context, which the AI analyzes and integrates into the prompt.
- **CFG Scale Control**: Fine-tune how strictly the generated prompt adheres to your concept details.
- **Customizable Template**: Modify the prompt generation template in settings for personalized AI instructions.
- **Export and Sharing**: Copy, download, or share generated prompts easily.
- **Dark Mode and Responsiveness**: Seamless experience across devices with light/dark/system theme switching.
- **Retry Logic and Error Handling**: Robust API interaction with configurable retries.
- **Local Storage Persistence**: Settings like API keys and templates are saved locally for convenience.
- **Privacy-Focused**: All data is processed client-side; no server-side storage.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cineprompt.git
   cd cineprompt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   (Or use `yarn install` or `bun install` if preferred.)

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## Usage

1. Open the app in your browser.
2. Enter your concept in the input field.
3. (Optional) Upload images for visual context.
4. Adjust parameters like style, camera, pacing, etc.
5. Set your Gemini API key in Settings (required for generation).
6. Click "Generate Video Prompt".
7. View, copy, download, or share the generated prompt.

For advanced customization, edit the prompt template in Settings.

## Configuration

- **API Key**: Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/) and set it in the Settings dialog. It's stored securely in your browser's localStorage.
- **Model Selection**: Choose from various Gemini models in the UI.
- **Max Retries**: Configure how many times to retry API calls on errors.
- **Theme**: Switch between light, dark, or system themes.

## Privacy and Data Handling

CinePrompt runs entirely client-side. Your API key, prompts, and images are never sent to any server other than Google's API during generation. Review the in-app Privacy Policy for details.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Shadcn UI](https://ui.shadcn.com/)
- Powered by [Google Gemini API](https://ai.google.dev/)
- Generated with inspiration from Lovable tools

For questions or support, open an issue on GitHub.
