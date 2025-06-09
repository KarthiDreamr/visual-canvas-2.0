# Vision Canvas

Vision Canvas is a simple web application that allows you to generate images with text for your local LLM vision model. You can control the canvas settings, add text, and export the canvas as an image or data.

## Features

- **Customizable Canvas:** Set the token count and pixel size to create a canvas of your desired dimensions.
- **Text Elements:** Add and position text elements on the canvas.
- **Export Options:** Export the canvas as a PNG image or as a JSON data file.
- **Overflow Warning:** Get a warning when the canvas size exceeds the recommended limits.
- **Simple Interface:** A clean and intuitive user interface for a smooth experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

### Installing

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/vision-canvas.git
   ```
2. Navigate to the project directory:
    ```sh
    cd vision-canvas
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
    or
    ```sh
    yarn install
    ```

### Running the Application

To run the application in development mode, use the following command:

```sh
npm run dev
```

This will start the development server and you can view the application at `http://localhost:5173`.

## Usage

1. **Adjust Settings:** Use the toolbar to set the token count and pixel size for the canvas.
2. **Add Text:** Click on the canvas to add text elements. You can drag and drop them to reposition.
3. **Export:** Use the "Export as Image" or "Export as Data" buttons to save your work.
4. **Clear Canvas:** Click the "Clear Canvas" button to start over.

## How to Contribute

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 