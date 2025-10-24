# Toast Notifications System

## Overview
Toast notification system based on React Bootstrap Toast component with auto-dismiss after 30 seconds and manual close option.

## Features
- ✅ Auto-hide after 30 seconds (configurable)
- ✅ Manual close button
- ✅ Multiple toast types (success, error, warning, info)
- ✅ Positioned at top-right corner
- ✅ Stacks multiple notifications
- ✅ Error handling from API responses

## Usage

### Import the hook
```typescript
import { useToast } from '@/contexts';
```

### Use in component
```typescript
const MyComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Success', 'Operation completed successfully!');
  };

  const handleError = () => {
    showError('Error', 'Something went wrong!');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
};
```

### Available methods

#### showSuccess(title: string, message: string)
Shows a success notification with green background.

#### showError(title: string, message: string)
Shows an error notification with red background.

#### showWarning(title: string, message: string)
Shows a warning notification with yellow background.

#### showInfo(title: string, message: string)
Shows an info notification with blue background.

#### showToast(type, title, message, autoHide?, delay?)
Custom toast with all options:
```typescript
showToast('success', 'Custom', 'Message', true, 5000); // 5 seconds
```

## Error Handling Utilities

### getErrorMessage(error: unknown): string
Extracts error message from API response or Error object.

### getErrorTitle(error: unknown): string
Returns appropriate error title based on HTTP status code.

### Example with API error handling
```typescript
try {
  await apiCall();
  showSuccess('Success', 'Data saved!');
} catch (error) {
  const title = getErrorTitle(error);
  const message = getErrorMessage(error);
  showError(title, message);
}
```

## Implementation Details

### ToastProvider
Wraps the application in `App.tsx`:
```typescript
<ToastProvider>
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
</ToastProvider>
```

### Toast Container
- Position: `top-end` (top-right corner)
- Z-index: `9999` (always on top)
- Auto-hide: `true` (default)
- Delay: `30000ms` (30 seconds, default)

## Styling
Toast notifications use React Bootstrap classes:
- Success: `bg-success text-white`
- Error: `bg-danger text-white`
- Warning: `bg-warning text-white`
- Info: `bg-info text-white`
