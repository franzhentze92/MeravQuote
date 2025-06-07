# MERAV Proyectos - Construction Quote Management

A mobile-friendly web application for construction contractors to create professional quotes quickly and efficiently.

## Features

- **Client Information Management**: Capture client details, contact info, and job site addresses
- **Job Category Selection**: Choose from various construction services (electrical, plumbing, renovation, etc.)
- **Dynamic Quote Building**: Add multiple line items with quantities, pricing, and tax calculations
- **Real-time Calculations**: Automatic subtotal, tax, and total calculations
- **Professional Output**: Generate and share professional quotes

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Git Repository Access Issue

If you encounter the error:
```
remote: Write access to repository not granted.
fatal: unable to access 'https://github.com/famous-apps-1/project-6842772c33181a18de266261.git/': The requested URL returned error: 403
```

**Solutions:**

1. **Check Repository Permissions**: Ensure you have write access to the repository
2. **Update Remote URL**: Use SSH instead of HTTPS:
   ```bash
   git remote set-url origin git@github.com:famous-apps-1/project-6842772c33181a18de266261.git
   ```
3. **Authentication**: Make sure your GitHub credentials are properly configured:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```
4. **Personal Access Token**: If using HTTPS, ensure you're using a valid personal access token instead of password
5. **Fork the Repository**: If you don't have write access, fork the repository and push to your fork instead

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/ui component library
- React Router for navigation
- TanStack Query for state management

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── ClientForm.tsx   # Client information form
│   ├── JobCategoryForm.tsx # Job category selection
│   ├── QuoteDetails.tsx # Quote line items management
│   ├── QuoteLineItem.tsx # Individual line item component
│   └── QuoteBuilder.tsx # Main quote builder orchestrator
├── contexts/
│   └── AppContext.tsx   # Global application state
├── pages/
│   ├── Index.tsx        # Home page
│   └── NotFound.tsx     # 404 page
└── lib/
    └── utils.ts         # Utility functions
```

## Usage

1. **Enter Client Information**: Fill in client details including name, contact info, and job site address
2. **Select Job Category**: Choose the type of construction work from the dropdown
3. **Add Quote Items**: Add line items with materials, labor, equipment, etc.
4. **Review & Generate**: Review the quote summary and generate/share the final quote

The application automatically calculates totals, taxes, and provides a professional quote summary ready for client presentation.