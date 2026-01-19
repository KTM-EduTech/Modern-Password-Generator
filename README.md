# Modern Password Generator

A beautiful, secure password generator using the Web Crypto API — no trackers, no dependencies.

![Modern Password Generator screenshot](https://ktm-edutech.github.io/Modern-Password-Generator/password_generator_ux.png)  
*(Modern Password Generator Interface)*

## Features

- Cryptographically secure randomness (`crypto.getRandomValues`)
- Glassmorphism + gradient dark UI
- Length 4–128 characters
- Toggle uppercase, lowercase, numbers, symbols
- Option to exclude confusing characters (1,i,l,I,o,O,0)
- Real-time strength meter & entropy estimate
- Guarantees at least one character from each selected type
- One-click copy (with fallback)
- Fully responsive · 100% vanilla HTML/CSS/JS

## Live Demo

→ [https://pasgen.ktm-edutech.net/](https://ktm-edutech.github.io/Modern-Password-Generator/)  
*(update once deployed)*

## Quick Start

Just open `index.html` in any modern browser — no installation needed.

## How Entropy is Rated

| Bits     | Strength     | Use Case                     |
|----------|--------------|------------------------------|
| ≤28      | Very weak    | —                            |
| 28–35    | Weak         | —                            |
| 36–59    | Moderate     | Casual / low-risk            |
| 60–127   | Strong       | Most accounts                |
| 128+     | Very strong  | Email, banking, crypto       |

## Project Files
