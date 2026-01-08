declare global {
    interface Window {
        auth0: {
            createAuth0Client: (config: Auth0ClientConfig) => Promise<Auth0Client>;
        };
    }
}

interface Auth0ClientConfig {
    domain: string;
    clientId: string;
    authorizationParams?: {
        redirect_uri?: string;
        scope?: string;
        audience?: string;
    };
    cacheLocation?: 'memory' | 'localstorage';
    useRefreshTokens?: boolean;
}

interface Auth0Client {
    loginWithPopup(options?: Auth0PopupOptions): Promise<void>;
    loginWithRedirect(options?: Auth0RedirectOptions): Promise<void>;
    handleRedirectCallback(): Promise<Auth0RedirectCallbackResult>;
    getIdTokenClaims(): Promise<Auth0IdTokenClaims | undefined>;
    getAccessTokenSilently(options?: Auth0GetTokenOptions): Promise<string>;
    logout(options?: Auth0LogoutOptions): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    getUser(): Promise<Auth0User | undefined>;
}

interface Auth0PopupOptions {
    authorizationParams?: {
        scope?: string;
        audience?: string;
    };
}

interface Auth0RedirectOptions {
    authorizationParams?: {
        redirect_uri?: string;
        scope?: string;
        audience?: string;
    };
    appState?: Record<string, unknown>;
}

interface Auth0RedirectCallbackResult {
    appState?: Record<string, unknown>;
}

interface Auth0IdTokenClaims {
    __raw: string;
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
    [key: string]: unknown;
}

interface Auth0GetTokenOptions {
    authorizationParams?: {
        scope?: string;
        audience?: string;
    };
    cacheMode?: 'on' | 'off' | 'cache-only';
}

interface Auth0LogoutOptions {
    logoutParams?: {
        returnTo?: string;
    };
    openUrl?: boolean | ((url: string) => void | Promise<void>);
}

interface Auth0User {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    nickname?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    [key: string]: unknown;
}

export {};
