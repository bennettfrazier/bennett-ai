# Bennett AI
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/)

## Overview
A Gen AI chatbot entirely built with v0.dev in less than a day's worth of effort.

This project was built so I could see how to test out the Vercel's AI SDK using V0.dev as a starting point.

Bennett AI is inspired from Claude, ChatGPT, Copilot, and other Gen AI chatbot interfaces and interactive elements.

## Quick Start

### Clone and install:
   ```bash
   git clone git@github.com:bennettfrazier/bennett-ai.git
   cd bennett-ai
   pnpm install
   ```

### Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Anthropic API key (starts with `sk-ant-`)
   
   To get an API key, go to [Anthropic's Console](https://console.anthropic.com/) and follow sign up instructions.

### Start the dev server:
   ```bash
   pnpm dev
   ```

## Available Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## Project features:
- Message streaming to display API response as it comes in
- Message reasoning with auto expansion, collapse, and scrolling
- Message response markdown styling using Tailwind Typography
- Welcome screen component that loads a random welcome message on page load
- Animations while response is "thinking"

## Under the hood:
- [Next.js 15](https://nextjs.org/)
- [Shadcn](https://ui.shadcn.com/)
- [Tailwind 4](https://tailwindcss.com/)
- [AI SDK](https://sdk.vercel.ai/)
- [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [Anthropic API – Claude Sonnet v3.7](https://www.anthropic.com/api)

