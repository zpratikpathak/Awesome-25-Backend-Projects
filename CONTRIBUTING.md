# 🤝 Contributing to Awesome Backend Projects

Thank you for your interest in contributing! 🎉 This repository is a community-driven collection of 25+ backend learning projects across multiple languages and frameworks.

Whether you're fixing a bug, adding test coverage, improving documentation, or refining architecture, your help is welcome!

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
- [Development Workflow](#-development-workflow)
- [Project Standards](#-project-standards)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Community & Questions](#-community--questions)

---

## 📜 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please be respectful, constructive, and kind in all communications, issues, and pull request reviews.

---

## 💡 How Can I Contribute?

You can contribute in many ways:

- 🐛 **Report or fix bugs:** Identify input validation flaws, edge cases, or broken tests.
- 📖 **Improve documentation:** Clarify README instructions, fix typos, or add code comments.
- 🧪 **Enhance tests:** Add regression checks, edge-case coverage, or mocked service tests.
- 🐳 **Improve Docker setups:** Optimize Dockerfiles, multi-stage builds, or `.dockerignore` patterns.
- 🚀 **Upgrade demo features:** Expand demo endpoints into richer learning examples.

---

## 🛠️ Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/zpratikpathak/Awesome-25-Backend-Projects.git
cd Awesome-25-Backend-Projects
```

### 2. Choose a Project

Each project is located in its own numbered directory (e.g., `01-url-shortener`, `02-todo-api`). Every project is completely independent.

### 3. Container-First Testing

To keep your machine clean and ensure reproducibility across platforms, **all dependency installation, builds, and test runs should be done inside Docker**:

```bash
# Example: testing project 01
cd 01-url-shortener
docker build -t backend01-check .
docker run --rm --network none backend01-check npm test
```

### 4. Create a Branch

```bash
git checkout -b feature/my-cool-improvement
```

---

## 📏 Project Standards

When modifying or adding to any project in this repository:

- 🔒 **Zero host clutter:** Ensure projects build and run cleanly via Docker.
- 🧪 **Runnable checks:** Every project must keep a runnable regression check (e.g., `npm test`, `pytest`, `go test`, `cargo test`).
- 🎭 **Mock external APIs:** Never require live third-party API keys (like Weather or Discord) for test suites. Use mocked HTTP/client responses.
- 🖼️ **Asset consistency:** Keep each project's centered SVG `logo.svg` intact.
- 🚫 **No secrets:** Never commit `.env` files, credentials, or private API keys.
- 📝 **Accurate documentation:** If you change an endpoint, input format, or environment variable, update the corresponding project's `README.md`.

---

## 🚀 Submitting a Pull Request

1. **Commit your changes:** Write clear, concise commit messages.
   ```bash
   git commit -m "fix(03-weather): handle empty query strings gracefully"
   ```
2. **Push to your fork:**
   ```bash
   git push origin feature/my-cool-improvement
   ```
3. **Open a Pull Request:**
   - Link any related issue(s).
   - Describe what changed and why.
   - Include the exact Docker test command you ran and the output.
   - Note any limitations or breaking changes.

---

## 💬 Community & Questions

Have questions or ideas?
- Open an [Issue](https://github.com/zpratikpathak/Awesome-25-Backend-Projects/issues) for bug reports and feature requests.
- Start a discussion for architecture ideas or project additions.

Thank you for helping make backend engineering accessible to everyone! 🌟
