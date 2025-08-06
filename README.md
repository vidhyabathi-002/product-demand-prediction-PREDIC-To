# predicTo: AI-Powered Product Demand Forecasting

**predicTo** is a sophisticated, enterprise-grade web application built with Next.js that empowers businesses to forecast product demand with high accuracy. It provides a comprehensive suite of tools for data preparation, model training, real-time scenario simulation, and AI-driven marketing insights.

## How it Works: An End-to-End Workflow

predicTo guides users through a complete machine learning pipeline, from raw data to actionable insights. The application is built around a simulated environment where users can experiment with different models and market scenarios to understand their impact on product demand.

1.  **Data Preparation**: The workflow begins on the **Data Preparation** page, where users can upload their historical sales data as a CSV file. The application provides a suite of preprocessing tools to clean and prepare the dataset, including:
    *   Handling missing values (e.g., dropping rows, filling with mean/median).
    *   Removing duplicates and managing outliers.
    *   Scaling data using normalization to make it suitable for ML models.

2.  **Train/Test Split**: Once the data is clean, users proceed to the **Train/Test Split** page. Here, the dataset is divided into training and testing sets, a critical step for validating the model's performance on unseen data and preventing overfitting.

3.  **Forecasting & Model Selection**: On the **Forecasting** page, users can select from a range of simulated machine learning models (ARIMA, Prophet, LSTM, XGBoost) to generate a demand forecast. The application runs a simulation, evaluates the model's performance on the test set, and presents a detailed forecast with performance metrics like Accuracy, F1-Score, and RMSE.

4.  **Dashboard Analytics & Simulation**: The **Dashboard** provides a high-level overview of key performance indicators (KPIs) and sales trends. Its core feature is the **Demand Simulation** panel, where users can adjust sliders for market factors like marketing spend and product price to see their immediate, real-time impact on the projected sales chart.

5.  **AI-Powered Insights**:
    *   **Promotional Ideas**: The dashboard includes an AI-powered feature to generate marketing copy tailored to the product description and market conditions.
    *   **Social Sentiment Analysis**: The **Analytics** page features a tool to analyze simulated social media posts, assess public sentiment, and provide a revised demand forecast based on the analysis.

## Core Features

-   **Advanced Demand Prediction**: Leverage a suite of simulated statistical models for accurate product demand forecasting.
-   **Interactive Dashboard Analytics**: Gain deep insights into product launch performance with dynamic charts, graphs, and key performance indicators (KPIs) visualizing sales trends, demand forecasts, and the impact of simulations.
-   **Real-time Simulation Engine**: Experiment with various market scenarios and instantly see the impact on demand forecasts through intuitive sliders and real-time updates.
-   **Intelligent Marketing Promotion Generation**: Generate compelling and targeted promotional text variations powered by AI, optimized for predicted demand and specific customer segments.
-   **Comprehensive Reporting**: Generate, view, and download detailed forecast reports that summarize the model's predictions and performance.
-   **User & Role Management**: An admin panel for managing user roles and permissions across the application.

## Getting Started

To get started with predicTo and unlock its capabilities, follow these steps:

1.  **Clone the repository:** Obtain the application code by cloning the GitHub repository using the following command:

    ```bash
    git clone <repository_url>
    ```

2.  **Install dependencies:** Navigate to the project directory in your terminal and install all the necessary dependencies by running:

    ```bash
    npm install
    ```

3.  **Run the development server:** Start the local development server with the following command:

    ```bash
    npm run dev
    ```

4.  **Open the application:** Open your preferred web browser and go to the following address to access the application:

    ```
    http://localhost:3000
    ```

5.  **Explore the features:** Once the application is loaded, take time to explore its various sections by selecting a user role on the login screen. The workflow is designed to be followed sequentially, starting from "Data Preparation".

## File Structure

-   `src/app/`: Contains all the pages of the application (e.g., `dashboard`, `preprocessing`, `reports`).
-   `src/components/`: Contains all React components, organized by feature (e.g., `dashboard`, `preprocessing`, `shared`).
-   `src/ai/flows/`: Houses the backend logic for AI and data science simulations, such as `predict-demand-from-csv.ts`.
-   `src/context/`: Contains React context providers for managing global state like user authentication, notifications, and settings.
-   `src/lib/`: Core utility functions.
-   `public/`: Static assets, including the sample dataset.

## Contributing

We welcome contributions from the community to improve predicTo. If you are interested in contributing, please refer to the `CONTRIBUTING.md` file (if available, or we will create one) for detailed guidelines on how to submit issues, propose features, and contribute code.

## License

This project is licensed under the [License Name] License. See the `LICENSE` file (if available, or we will create one) for more details.
