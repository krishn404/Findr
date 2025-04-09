
<h1 align="center">
  <img src="public/findr.png" alt="Findr Logo" width="200">
  <br>
  Findr - Your Perfect Car Finder 🚗
</h1>

<p align="center">
  ✨ An Assignment Task: Find your dream car with our modern and intuitive car search application. ✨
</p>

<p align="center">
  <a href="https://github.com/krishn404/Findr">
    <img src="https://img.shields.io/badge/GitHub-krishn404%2FFindr-blue?style=flat-square" alt="GitHub Repo">
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-15.2.4-orange?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js Version">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.1-blue?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Version">
  </a>
</p>

## 🌟 Features

-   **Extensive Car Collection**: Browse through a wide range of vehicles.
-   **Advanced Search**: Powerful filtering options to narrow down your search. 🔍
-   **Wishlist**: Save your favorite cars for later. ❤️
-   **Car Details**: Detailed information about each car. ℹ️
-   **Modern UI**: Built with Radix UI and Tailwind CSS for a sleek and responsive design. 🎨
-   **Theming**: Supports light and dark themes. 🌙☀️
-   **Progressive Web App (PWA)**: Installable and offline support. 🚀

## 🛠️ Technologies Used

-   [Next.js](https://nextjs.org/) - React framework for building performant web applications.
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
-   [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components for building high-quality user interfaces.
-   [Lucide React](https://lucide.dev/) - Beautifully simple, pixel-perfect icons.
-   [idb](https://github.com/jakearchibald/idb) -  IndexedDB wrapper for a better developer experience.
-   [framer-motion](https://www.framer.com/motion/) - Production-ready motion library for React.
-   [next-pwa](https://github.com/shadowwalker/next-pwa) - Zero config PWA plugin for Next.js

## 🚀 Setup Instructions

Follow these steps to get the project up and running on your local machine:

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20 or higher)
-   [pnpm](https://pnpm.io/) (recommended) or npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/krishn404/Findr.git
    cd Findr
    ```

2.  Install the dependencies using pnpm:

    ```bash
    pnpm install
    ```

    or npm:

    ```bash
    npm install
    ```

    or yarn:

    ```bash
    yarn install
    ```

### Development

1.  Start the development server:

    ```bash
    pnpm dev
    ```

    or npm:

    ```bash
    npm run dev
    ```

    or yarn:

    ```bash
    yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:3000`.

### Building and Running in Production

1.  Build the application:

    ```bash
    pnpm build
    ```

    or npm:

    ```bash
    npm run build
    ```

    or yarn:

    ```bash
    yarn build
    ```

2.  Start the production server:

    ```bash
    pnpm start
    ```

    or npm:

    ```bash
    npm start
    ```

    or yarn:

    ```bash
    yarn start
    ```

## ⚙️ Configuration

The project uses the following configuration files:

-   `components.json`: Configuration for `shadcn-ui` components.
-   `next.config.mjs`: Next.js configuration file.
-   `postcss.config.mjs`: PostCSS configuration file.
-   `tailwind.config.ts`: Tailwind CSS configuration file.
-   `tsconfig.json`: TypeScript configuration file.

## 📝 Notes
The mock car data is stored in `lib/data.ts`. You can modify this file to add or remove cars.

```