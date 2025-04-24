# Bennett AI
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/)

## Overview
A Next.js Gen AI chatbot clone entirely with v0.dev in less than a day's worth of effort.

This project was built because I wanted to see how I could test out the AI SDK built by Vercel using V0 as a starting point.

Bennett AI is inspired from Claude, ChatGPT, Copilot, and other Gen AI chatbots.

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
