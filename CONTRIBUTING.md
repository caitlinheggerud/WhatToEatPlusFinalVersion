# Contributing to WhatToEat+

Thank you for your interest in contributing to WhatToEat+! We appreciate your help in making this project better. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## How Can I Contribute?

There are several ways you can contribute to the project:

1. **Report Bugs**: Submit bug reports through our issue tracker.
2. **Suggest Features**: Propose new features or improvements.
3. **Improve Documentation**: Help us improve our documentation.
4. **Submit Code Changes**: Implement bug fixes or new features.

## Reporting Bugs

When reporting bugs, please include:

- A clear and descriptive title
- Detailed steps to reproduce the bug
- Expected behavior vs. actual behavior
- Screenshots (if applicable)
- Your environment information (browser, OS, etc.)
- Any additional context or information

Use the bug report template when creating a new issue.

## Suggesting Features

Feature suggestions should include:

- A clear and descriptive title
- Detailed description of the proposed feature
- Explanation of why this feature would be useful
- Examples of how the feature would work
- Screenshots or mockups (if applicable)

Use the feature request template when suggesting features.

## Development Setup

Please refer to the [SETUP.md](SETUP.md) file for detailed instructions on setting up your development environment.

## Pull Request Process

1. **Fork the Repository**: Create your own fork of the project.

2. **Create a Branch**: Create a branch for your contribution.
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use a descriptive branch name that reflects your changes:
   - `feature/new-feature-name` for new features
   - `fix/bug-name` for bug fixes
   - `docs/update-area` for documentation changes

3. **Make Your Changes**: Implement your changes, additions, or fixes.

4. **Follow Coding Standards**:
   - Use TypeScript for type safety
   - Follow ESLint rules defined in the project
   - Use consistent code formatting
   - Write clean, maintainable code
   - Include comments where necessary

5. **Write Tests**: Add tests for your changes when applicable.

6. **Update Documentation**: Update the README.md or other documentation if necessary.

7. **Commit Your Changes**: Use clear and descriptive commit messages.
   ```bash
   git commit -m "Add feature: brief description of what was added"
   ```

8. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Submit a Pull Request**: Create a pull request from your fork to the main repository.
   - Provide a clear description of the changes
   - Link any related issues
   - Explain the purpose and benefits of your changes

10. **Code Review**: Respond to any feedback on your pull request.

11. **Merge**: Once approved, your pull request will be merged.

## Coding Standards

### TypeScript

- Use TypeScript for type safety
- Define interfaces for all data structures
- Avoid using `any` type where possible
- Use proper error handling with typed errors

### React Components

- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use the destructuring syntax for props
- Use TypeScript interfaces for component props
- Document complex components with JSDoc comments

### CSS / Styling

- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design principles
- Keep styling consistent with the existing design system

### Backend Code

- Organize routes logically
- Use the repository pattern for data access
- Implement proper error handling
- Validate input data
- Return appropriate HTTP status codes

### Testing

- Write unit tests for utilities and hooks
- Write integration tests for API endpoints
- Mock external dependencies in tests

## Git Workflow

We follow a GitHub flow workflow:

1. Fork the repository
2. Create a feature branch from main
3. Make changes and commit
4. Push to your fork
5. Create a pull request

### Commit Messages

Follow these guidelines for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Example:
```
Add receipt scanning feature

- Implement Gemini API integration
- Add receipt image preprocessing
- Create receipt item extraction logic

Fixes #123
```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

If you have any questions about contributing, please feel free to open an issue or contact the project maintainers directly.

Thank you for contributing to WhatToEat+!