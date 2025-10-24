# Server Architecture Guidelines

## 🚨 CRITICAL RULE: Entity Model Placement

### ⚠️ STRICT RULE

```
Entity models (EF Core) MUST be placed in Infrastructure/Entities/

❌ DO NOT place Entity models in Domain/Entities/
✅ ALWAYS place Entity models in Infrastructure/Entities/
```

### Why?

- **Entity** = Database models (technical storage implementation)
- **Domain** = Business logic (DTOs, Enums, Interfaces)
- **Infrastructure** = Responsible for database operations and data persistence

### Correct Structure

```
Infrastructure/
├── Entities/                    ← DATABASE ENTITY MODELS HERE
│   ├── Project.cs              ← EF Core Entity
│   ├── ProjectFile.cs          ← EF Core Entity
│   ├── LicenseType.cs          ← EF Core Entity
│   ├── Profession.cs           ← EF Core Entity
│   ├── ProjectLicenseType.cs   ← EF Core Entity
│   └── Identity/
│       └── ApplicationUser.cs  ← Identity Entity
├── Data/
│   └── ApplicationDbContext.cs ← Uses Infrastructure.Entities
└── Migrations/                 ← EF Core Migrations

Domain/
├── DTOs/                       ← Data Transfer Objects (business logic)
│   ├── ProjectDto.cs
│   └── CreateProjectDto.cs
├── Enums/                      ← Enumerations
│   └── ProjectStatus.cs
└── Interfaces/                 ← Service contracts
    └── IProjectService.cs
```

### Code Examples

**❌ WRONG - Entity in Domain:**
```csharp
namespace DigitalEngineers.Domain.Entities;

public class Project { } // WRONG LOCATION!
```

**✅ CORRECT - Entity in Infrastructure:**
```csharp
namespace DigitalEngineers.Infrastructure.Entities;

public class Project { } // CORRECT LOCATION!
```

**✅ CORRECT - Using Entities in Services:**
```csharp
// Application/Services/ProjectService.cs
using DigitalEngineers.Infrastructure.Entities; // Infrastructure.Entities
using DigitalEngineers.Domain.DTOs;             // Domain.DTOs
using DigitalEngineers.Infrastructure.Data;

namespace DigitalEngineers.Application.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;

    public async Task<ProjectDto> GetProjectAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id); // Infrastructure.Entities.Project
        
        return new ProjectDto(                               // Domain.DTOs.ProjectDto
            project.Id,
            project.Name,
            project.Description,
            project.Status.ToString(),
            project.CreatedAt
        );
    }
}
```

---

## Project Overview

**DigitalEngineers** server is built using .NET 9 with Clean Architecture pattern and multi-project structure.

---

## Project Structure

```
Server/
├── DigitalEngineers.Domain/          # Domain Layer
│   ├── DTOs/                         # Data Transfer Objects
│   │   ├── Auth/                     # Auth DTOs
│   │   │   ├── RegisterDto.cs       # 6 fields
│   │   │   ├── TokenData.cs         # 4 fields
│   │   │   └── UserDto.cs           # 5 fields
│   │   ├── ProfessionalTypeDto.cs
│   │   └── StateDto.cs
│   ├── Enums/                        # Domain enumerations
│   │   └── UserRole.cs
│   └── Interfaces/                   # Service interfaces
│       ├── IAuthService.cs
│       ├── IDictionaryService.cs
│       └── ITokenService.cs
│
├── DigitalEngineers.Application/     # Application Layer
│   ├── Services/                     # Service implementations
│   │   ├── AuthService.cs
│   │   ├── DictionaryService.cs
│   │   └── TokenService.cs
│   └── Extensions/
│       └── ServiceCollectionExtensions.cs
│
├── DigitalEngineers.Infrastructure/  # Infrastructure Layer
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Entities/                     # ⚠️ DATABASE ENTITY MODELS (EF Core)
│   │   ├── Project.cs                # ← EF Core Entity
│   │   ├── ProjectFile.cs            # ← EF Core Entity
│   │   ├── LicenseType.cs            # ← EF Core Entity
│   │   ├── Profession.cs             # ← EF Core Entity
│   │   ├── ProjectLicenseType.cs     # ← EF Core Entity
│   │   └── Identity/
│   │       └── ApplicationUser.cs    # ← Identity Entity
│   ├── Migrations/                   # EF Core migrations
│   └── Seeders/
│       └── DataSeeder.cs
│
├── DigitalEngineers.API/            # Presentation Layer
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── DictionaryController.cs
│   ├── ViewModels/                  # API contracts (ViewModels)
│   │   ├── Auth/
│   │   │   ├── LoginViewModel.cs
│   │   │   ├── RegisterViewModel.cs
│   │   │   ├── RefreshTokenViewModel.cs
│   │   │   ├── ExternalLoginViewModel.cs
│   │   │   ├── UserViewModel.cs
│   │   │   └── TokenResponseViewModel.cs
│   │   └── Dictionary/
│   │       ├── ProfessionalTypeViewModel.cs
│   │       └── StateViewModel.cs
│   ├── Mappings/                    # AutoMapper profiles
│   │   ├── AuthMappingProfile.cs
│   │   └── DictionaryMappingProfile.cs
│   └── Program.cs
│
└── DigitalEngineers.Shared/         # Shared utilities/enums/helpers etc 

```

---

## Layer Architecture

```
┌───────────────────────────────┐
│  DigitalEngineers.API         │  ← ViewModels, Controllers, Mappings
│  (Presentation)               │
└───────────┬───────────────────┘
            │
            ↓
┌───────────────────────────────┐
│  DigitalEngineers.Application │  ← Service implementations
│  (Services)                   │
└───────────┬───────────────────┘
            │
            ↓
┌───────────────────────────────┐
│  DigitalEngineers.Domain      │  ← DTOs, Interfaces, Enums
│  (Core)                       │
└───────────────────────────────┘
            ↑
            │
┌───────────────────────────────┐
│  DigitalEngineers.             │  ← DbContext, Identity, Migrations
│  Infrastructure               │
└───────────────────────────────┘

┌───────────────────────────────┐
│  DigitalEngineers.Shared      │  ← Used by all layers
└───────────────────────────────┘
```

---

## Layer Responsibilities

### 1. Domain Layer

**Type:** Class Library  
**Target:** .NET 9.0  
**Dependencies:** `Microsoft.Extensions.Identity.Stores` (9.0.10)

**Contains:**
- DTOs for service layer
- Service interfaces
- Business logic contracts

**Rules:**
- ✅ Contains only domain logic
- ✅ Defines service contracts
- ❌ No infrastructure dependencies
- ❌ No framework-specific code

---

### 2. Application Layer

**Type:** Class Library  
**Target:** .NET 9.0  
**Dependencies:**
- DigitalEngineers.Domain
- DigitalEngineers.Infrastructure
- DigitalEngineers.Shared
- AutoMapper.Extensions.Microsoft.DependencyInjection (12.0.1)
- Google.Apis.Auth (1.72.0)
- Microsoft.Extensions.Configuration.Abstractions (9.0.10)

**Contains:**
- Service implementations
- Business logic
- Service extensions

**Rules:**
- ✅ Implements interfaces from Domain
- ✅ Uses DTOs from Domain
- ✅ Direct DbContext usage (no Repository pattern because DbContext it's UnitOfWork pattern)
- ❌ No presentation logic
- ❌ No HTTP concerns

---

### 3. Infrastructure Layer

**Type:** Class Library  
**Target:** .NET 9.0  
**Dependencies:**
- DigitalEngineers.Domain
- Google.Apis.Auth (1.72.0)
- Microsoft.AspNetCore.Authentication.Google (9.0.10)
- Microsoft.AspNetCore.Authentication.JwtBearer (9.0.10)
- Microsoft.AspNetCore.Identity.EntityFrameworkCore (9.0.10)
- Npgsql.EntityFrameworkCore.PostgreSQL (9.0.4)

**Contains:**
- **Entities/** - Database models (EF Core Entity classes)
- DbContext
- Migrations
- Data seeders

**Rules:**
- ✅ Contains data access logic
- ✅ **Entity models MUST be in Infrastructure/Entities/**
- ✅ Uses PostgreSQL with EF Core
- ✅ DbContext used directly in services
- ❌ No Repository pattern (DbContext is Unit of Work)
- ❌ No business logic
- ❌ **DO NOT place Entity models in Domain/Entities/**

---

### 4. API Layer

**Type:** ASP.NET Core Web API  
**Target:** .NET 9.0  
**Dependencies:**
- DigitalEngineers.Application
- DigitalEngineers.Infrastructure
- DigitalEngineers.Shared
- AutoMapper.Extensions.Microsoft.DependencyInjection (12.0.1)
- Microsoft.AspNetCore.OpenApi (9.0.9)
- Microsoft.EntityFrameworkCore.Design (9.0.10)

**Contains:**
- Controllers
- ViewModels (API contracts)
- AutoMapper profiles
- Program.cs

**Rules:**
- ✅ Uses ViewModels for all endpoints
- ✅ Maps ViewModels ↔ DTOs
- ✅ No business logic
- ❌ Never return domain entities
- ❌ No direct DbContext access

---

### 5. Shared Layer

**Type:** Class Library  
**Target:** .NET 9.0  
**Dependencies:** None

**Contains:**
- Extension methods
- Constants
- Utilities
- Shared enums

---

## DTO vs ViewModel Strategy

### ViewModels (API Layer)
**Purpose:** API contract - what client sees  
**Location:** `DigitalEngineers.API/ViewModels/`

**Rules:**
- ✅ Always create for API endpoints (regardless of field count)
- ✅ Used in controllers
- ✅ Mapped to/from DTOs or service parameters

**Examples:**
```csharp
// Simple (2 fields) - still needed for API contract
public class LoginViewModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// Complex (6 fields)
public class RegisterViewModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Role { get; set; } = string.Empty;
}
```

---

### DTOs (Domain Layer)
**Purpose:** Service layer communication  
**Location:** `DigitalEngineers.Domain/DTOs/`

**Rules:**
- ✅ Create only for complex objects (4+ fields)
- ✅ Used in service interfaces
- ❌ Not for 2-3 field methods (use parameters)

**Examples:**
```csharp
// Complex - used as DTO
public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Role { get; set; } = string.Empty;
}

// Simple - NOT created as DTO, use parameters instead
// ❌ LoginDto - deleted
// ✅ LoginAsync(string email, string password, ...)
```

---

### Service Parameters
**Purpose:** Simple data passing  
**Rules:** Use for 2-3 field methods

**Examples:**
```csharp
public interface IAuthService
{
    // Complex (6 fields) - uses DTO
    Task<TokenData> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default);
    
    // Simple (2 fields) - uses parameters
    Task<TokenData> LoginAsync(string email, string password, CancellationToken cancellationToken = default);
    
    // Simple (2 fields) - uses parameters
    Task<TokenData> RefreshTokenAsync(string accessToken, string refreshToken, CancellationToken cancellationToken = default);
    
    // Simple (2 fields) - uses parameters
    Task<TokenData> ExternalLoginAsync(string provider, string idToken, CancellationToken cancellationToken = default);
}
```

---

## Data Flow

### Request Flow
```
Client 
  → ViewModel (API) 
  → Controller maps to DTO/Parameters 
  → Service 
  → DbContext 
  → Database
```

### Response Flow
```
Database 
  → DbContext 
  → Service 
  → DTO 
  → Controller maps to ViewModel 
  → Client
```

---

## Controller Patterns

### Complex DTO (4+ fields)
```csharp
[HttpPost("register")]
public async Task<ActionResult<TokenResponseViewModel>> Register(
    [FromBody] RegisterViewModel viewModel,
    CancellationToken cancellationToken)
{
    var dto = _mapper.Map<RegisterDto>(viewModel);
    var response = await _authService.RegisterAsync(dto, cancellationToken);
    var result = _mapper.Map<TokenResponseViewModel>(response);
    return Ok(result);
}
```

### Simple Parameters (2-3 fields)
```csharp
[HttpPost("login")]
public async Task<ActionResult<TokenResponseViewModel>> Login(
    [FromBody] LoginViewModel viewModel,
    CancellationToken cancellationToken)
{
    var response = await _authService.LoginAsync(
        viewModel.Email, 
        viewModel.Password, 
        cancellationToken);
    var result = _mapper.Map<TokenResponseViewModel>(response);
    return Ok(result);
}
```

---

## AutoMapper Configuration

**Registration in Program.cs:**
```csharp
builder.Services.AddAutoMapper(typeof(Program).Assembly);
```

**Mapping Profiles:**
- `AuthMappingProfile` - Auth ViewModels ↔ DTOs
- `DictionaryMappingProfile` - Dictionary ViewModels ↔ DTOs

**Example:**
```csharp
public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        // Request (complex only)
        CreateMap<RegisterViewModel, RegisterDto>();

        // Response
        CreateMap<UserDto, UserViewModel>();
        CreateMap<TokenData, TokenResponseViewModel>();
    }
}
```

---

## Database Strategy

**ORM:** Entity Framework Core 9.0.10  
**Database:** PostgreSQL (Npgsql 9.0.4)  
**Pattern:** DbContext directly in services

**Why no Repository?**
- DbContext already implements Unit of Work
- Repository adds unnecessary abstraction
- Direct DbContext provides full EF Core features

---

## Authentication & Authorization

**Stack:**
- ASP.NET Core Identity
- JWT Bearer tokens
- Google OAuth
- Refresh tokens

**Implementation:**
- `ApplicationUser` extends `IdentityUser`
- Token generation in `TokenService`
- Auth logic in `AuthService`

---

## Naming Conventions

**C# Files:**
```
Controllers:  {Entity}Controller.cs
Services:     {Entity}Service.cs
Interfaces:   I{Entity}Service.cs
ViewModels:   {Purpose}ViewModel.cs
DTOs:         {Purpose}Dto.cs
```

**Namespaces:**
```csharp
namespace DigitalEngineers.{Layer}.{Folder};
```

**Code Style:**
```csharp
// Classes
public class UserService { }

// Interfaces
public interface IUserService { }

// Methods
public async Task<User> GetUserAsync() { }

// Private fields
private readonly IUserService _userService;

// Constants
public const string API_VERSION = "v1";
```

---

## Development Rules

### Model Selection
1. **2-3 fields** → Service parameters
2. **4+ fields** → DTO class
3. **API contracts** → Always ViewModel

### Service Implementation
- ✅ Use `async/await` for all I/O
- ✅ Accept `CancellationToken`
- ✅ Use DbContext directly
- ✅ Return DTOs from Domain
- ✅ Use classes for DTOs (not records)
- ❌ Never return entities
- ❌ No business logic in controllers

### Controller Implementation
- ✅ Accept ViewModels
- ✅ Return ViewModels
- ✅ Use AutoMapper for mapping
- ✅ Pass simple parameters directly
- ✅ Use classes for ViewModels (not records)
- ❌ No business logic
- ❌ No direct DbContext

---

## Migrations

```bash
# Add migration
cd Server/DigitalEngineers.Infrastructure
dotnet ef migrations add MigrationName --startup-project ../DigitalEngineers.API

# Apply migration
dotnet ef database update --startup-project ../DigitalEngineers.API

# Remove last migration
dotnet ef migrations remove --startup-project ../DigitalEngineers.API
```

---

## Dependency Rules

**Allowed:**
```
API → Application → Domain
API → Infrastructure → Domain
API → Shared
Application → Domain
Application → Infrastructure (for Entities access)
Application → Shared
Infrastructure → Domain
```

**Forbidden:**
```
Domain → Application ❌
Domain → Infrastructure ❌
Domain → API ❌
Application → API ❌
Infrastructure → API ❌
Shared → Any other project ❌
Domain/Entities → Entity models ❌ (USE Infrastructure/Entities/)
```

**Critical:**
```
✅ Infrastructure/Entities/ - Database Entity models location
❌ Domain/Entities/ - NEVER place Entity models here
```

---

**Architecture:** Clean Architecture with multi-project structure  
**Framework:** .NET 9  
**Entity Location:** Infrastructure/Entities/ (STRICT RULE)
