# План работ: API для списка бидов админа

## 📊 Анализ существующей структуры

### ✅ Доступные данные из Entity `Project`
- `Id` - ID проекта
- `Name` - Название проекта
- `Status` (enum ProjectStatus) - статус проекта
- `CreatedAt` - дата создания (используем вместо StartDate)
- `BidRequests` (навигационное свойство) - связь с бидами
- `Budget` - создать поле!
- `StartDate` - создать поле!

### ✅ Доступные данные из Entity `BidRequest`
- `Status` (enum BidRequestStatus) - статус бида
- `ProposedBudget` - предложенный бюджет
- Связь с Project через `ProjectId`

### 📋 Enum BidRequestStatus
```csharp
public enum BidRequestStatus
{
    Open = 0,      // ← Считаем как Pending
    Active = 1,    // ← Считаем как Responded
    Closed = 2,    // ← Считаем как Responded
    Cancelled = 3  // ← Не учитываем
}
переделать с новыми знаениями
нужны Pending, Responded, Approved ,Cancelled
```
BidRequestDto заменить string Status на BidRequestStatus enum
---

## 🏗️ Структура реализации

### Шаг 1: Создать DTO
**Файл:** `Server/DigitalEngineers.Domain/DTOs/ProjectBidsSummaryDto.cs`

```csharp
namespace DigitalEngineers.Domain.DTOs;

/// <summary>
/// DTO для элемента списка бидов админа
/// </summary>
public class ProjectBidsSummaryDto
{
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public enum ProjectStatus { get; set; }  enum 
    public decimal ProjectBudget { get; set; } 
    public DateTime StartDate { get; set; } 
    public int PendingBidsCount { get; set; } // Status = Pending
    public int RespondedBidsCount { get; set; } // Status = Responded/Closed
}
```

---

### Шаг 2: Добавить метод в IBidService
**Файл:** `Server/DigitalEngineers.Application/Services/IBidService.cs` (интерфейс)

```csharp
public interface IBidService
{
    // ...existing methods...
    
    /// <summary>
    /// Получить список проектов с информацией о бидах для админа
    /// </summary>
    Task<List<ProjectBidsSummaryDto>> GetProjectBidsSummaryAsync();
}
```

---

### Шаг 3: Реализовать метод в BidService
**Файл:** `Server/DigitalEngineers.Application/Services/BidService.cs`

---

### Шаг 4: Добавить endpoint в BidsController
**Файл:** `Server/DigitalEngineers.API/Controllers/BidsController.cs`

**Endpoint:** `GET /api/bids/summary`

**Авторизация:** Только Admin и SuperAdmin

---

## 🚀 Готов к реализации!

**Клиент использует:** уже созданные компоненты в `Client/digitalengineers.client/src/app/admin/bids/`
