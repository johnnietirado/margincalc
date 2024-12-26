# Codealo Sample App

## Overview

Codealo Sample App is a modern SaaS platform built with Next.js, TypeScript, and various other cutting-edge technologies. This project serves as a comprehensive example of a full-featured web application, including user authentication, dashboard functionality, and integration with services like Stripe for payments.

## Features

- User authentication and authorization
- Dashboard for managing products and users
- Stripe integration for payment processing
- Responsive design with dark mode support
- AI-powered chatbot
- Email functionality using React Email
- FAQ and Terms & Conditions pages
- Contact form with email notifications

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Drizzle ORM
- tRPC
- Stripe
- React Email
- Zod for schema validation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```

## Project Structure

- `src/app`: Next.js app router and page components
- `src/components`: Reusable React components
- `src/lib`: Utility functions and shared logic
- `src/emails`: Email templates using React Email
- `src/database`: Database schema and queries using Drizzle ORM

## Key Components

### Landing Page

The landing page includes several sections:

- Hero section
- Feature section
- Pricing section
- FAQ section
- Testimonial section
- CTA section

For example, the Hero section can be found here:

### Dashboard

The dashboard includes features like:

- Product management
- User management
- Stripe integration for creating products


## Deployment

This project is set up to be deployed on Vercel. Make sure to configure the necessary environment variables in your Vercel project settings.

### Authentication

The project uses NextAuth for authentication. Make sure to set up the necessary providers and configure the authentication options.

### Database

The project uses Drizzle ORM for database operations. The schema for products can be found here:

## License

This project is licensed under the MIT License.

## Traducción al Español

### Descripción

La aplicación de muestra Codealo es una plataforma SaaS moderna construida con Next.js, TypeScript y varias otras tecnologías de vanguardia. Este proyecto sirve como un ejemplo completo de una aplicación web con todas las funciones, incluyendo autenticación de usuarios, funcionalidad de panel de control e integración con servicios como Stripe para pagos.

### Características

- Autenticación y autorización de usuarios
- Panel de control para gestionar productos y usuarios
- Integración con Stripe para procesamiento de pagos
- Diseño responsivo con soporte para modo oscuro
- Chatbot impulsado por IA
- Funcionalidad de correo electrónico utilizando React Email
- Páginas de Preguntas Frecuentes y Términos y Condiciones
- Formulario de contacto con notificaciones por correo electrónico

### Stack Tecnológico

- Next.js 14
- TypeScript
- Tailwind CSS
- Componentes de Shadcn UI
- Drizzle ORM
- tRPC
- Stripe
- React Email
- Zod para validación de esquemas

### Cómo Empezar

1. Clona el repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Configura las variables de entorno (ver `.env.example`)
4. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```

### Estructura del Proyecto

- `src/app`: Enrutador de la aplicación Next.js y componentes de página
- `src/components`: Componentes reutilizables de React
- `src/lib`: Funciones utilitarias y lógica compartida
- `src/emails`: Plantillas de correo electrónico utilizando React Email
- `src/database`: Esquema de base de datos y consultas utilizando Drizzle ORM

### Componentes Clave

#### Página de Aterrizaje

La página de aterrizaje incluye varias secciones:

- Sección de héroe
- Sección de características
- Sección de precios
- Sección de preguntas frecuentes
- Sección de testimonios
- Sección de llamada a la acción

Por ejemplo, la sección de héroe se puede encontrar aquí:

#### Panel de Control

El panel de control incluye características como:

- Gestión de productos
- Gestión de usuarios
- Integración con Stripe para crear productos

### Despliegue

Este proyecto está configurado para ser desplegado en Vercel. Asegúrate de configurar las variables de entorno necesarias en la configuración de tu proyecto en Vercel.

#### Autenticación

El proyecto utiliza NextAuth para la autenticación. Asegúrate de configurar los proveedores necesarios y las opciones de autenticación.

#### Base de Datos

El proyecto utiliza Drizzle ORM para operaciones de base de datos. El esquema para productos se puede encontrar aquí:
