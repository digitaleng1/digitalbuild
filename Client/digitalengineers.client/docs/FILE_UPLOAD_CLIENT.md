# File Upload Integration - Client

## Overview
Client-side implementation for atomic project creation with file uploads.

## Changes Made

### 1. **Updated Types** (`src/types/project.ts`)
```typescript
export interface ProjectFormData {
  // ...existing fields...
  files: File[];           // NEW: Array of files
  thumbnail: File | null;  // NEW: Project thumbnail (future)
}

// Removed: documentUrls: string[]
```

### 2. **Updated ProjectService** (`src/services/projectService.ts`)
- Changed from JSON to `multipart/form-data`
- Creates `FormData` object with all project fields
- Appends files using `formData.append('files', file)`
- Handles thumbnail upload

### 3. **Updated ProjectWizardContext**
- Removed `documentUrls` from initial state
- Added `files: []` and `thumbnail: null`
- No logic changes - still atomic submission

### 4. **Created FileUploader Component** (`src/components/FileUploader.tsx`)

**Features:**
- ✅ Drag-and-drop support
- ✅ Click to upload
- ✅ File validation (size, type)
- ✅ Preview uploaded files with remove option
- ✅ Progress indication
- ✅ Error handling
- ✅ Responsive design

**Props:**
```typescript
interface FileUploaderProps {
  label?: string;
  helpText?: string;
  maxFiles?: number;              // Default: 10
  maxFileSize?: number;           // Default: 10MB
  acceptedFileTypes?: string[];   // Default: .pdf, .doc, etc.
  onFilesChange: (files: File[]) => void;
  value: File[];
}
```

**Usage:**
```tsx
<FileUploader
  label="Project Documents"
  maxFiles={10}
  maxFileSize={10}
  acceptedFileTypes={['.pdf', '.doc', '.docx']}
  onFilesChange={setFiles}
  value={files}
/>
```

### 5. **Updated Step3DetailsDocuments**
- Replaced `TagInput` (for URLs) with `FileUploader`
- Files stored in local state
- Submitted atomically with project
- Added file size/count display

## User Flow

```
Step 1: Project Title + Professionals
   ↓
Step 2: Location + Scope
   ↓
Step 3: Description + Files
   ↓
Submit (ONE REQUEST):
├─ Project data
├─ Description
└─ Files[]
   ↓
Backend creates:
├─ Project in DB
├─ Files in S3
└─ File metadata in DB
   ↓
Response: Success or Error (atomic)
```

## File Validation

**Client-side:**
- Maximum file size: 10MB per file
- Maximum files: 10 files
- Allowed types: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.png`, `.jpg`, `.jpeg`, `.dwg`
- Instant feedback on invalid files

**Server-side:**
- Same validation in `CreateProjectViewModel`
- Transaction rollback if S3 upload fails
- Automatic cleanup of orphaned files

## API Request Format

```typescript
POST /api/projects
Content-Type: multipart/form-data

FormData:
├─ name: "Project Name"
├─ description: "..."
├─ streetAddress: "..."
├─ city: "..."
├─ state: "NY"
├─ zipCode: "10001"
├─ projectScope: "1"
├─ licenseTypeIds: [1, 2, 3]
├─ files: File[]           // Multiple files
└─ thumbnail: File         // Optional
```

## Benefits

1. ✅ **Atomic Operation** - project + files created together
2. ✅ **Better UX** - single loading state
3. ✅ **Reliable** - transaction rollback on errors
4. ✅ **Clean Code** - no multiple API calls
5. ✅ **File Preview** - users see what they're uploading
6. ✅ **Drag & Drop** - modern UX
7. ✅ **Validation** - instant feedback on errors

## File Display

**Before Upload:**
```
┌──────────────────────────────────┐
│  📁 Click to upload or drag drop │
│  .pdf, .doc, .docx (max 10MB)    │
│  Maximum 10 files allowed         │
└──────────────────────────────────┘
```

**After Upload:**
```
Uploaded Files (3/10)
┌──────────────────────────────────┐
│ 📄 document1.pdf        [X]      │
│    2.5 MB                        │
├──────────────────────────────────┤
│ 📄 blueprint.dwg        [X]      │
│    8.1 MB                        │
├──────────────────────────────────┤
│ 📄 specs.docx           [X]      │
│    1.2 MB                        │
└──────────────────────────────────┘
```

## Error Handling

**File too large:**
```
⚠️ File "document.pdf" exceeds maximum size of 10MB
```

**Too many files:**
```
⚠️ Maximum 10 files allowed
```

**Invalid type:**
```
⚠️ File "image.gif" has unsupported type. Allowed: .pdf, .doc, .docx, ...
```

**Server error:**
```
🔴 Error
Failed to create project. Please try again.
```

## Future Enhancements

- [ ] Thumbnail upload UI
- [ ] Image preview for `.png`, `.jpg`
- [ ] PDF preview
- [ ] Upload progress bar per file
- [ ] Compress images before upload
- [ ] Resume interrupted uploads
