# Rally OAuth Serverless

Serverless functions for rally OAuth

[![Netlify Deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Ju99ernaut/netlify-oauth-serverless)

## Workflow

![Rally OAuth](https://user-images.githubusercontent.com/48953676/115887451-3cd81600-a452-11eb-9284-5d8c46bed55c.png)


## Examples

### Browser
```js
let user = null;
const fragment = new URLSearchParams(window.location.hash.slice(1));
window.location.hash = "";
history.pushState('', document.title, `${window.location.pathname}${window.location.search}`)

if (fragment.has("username")) {
    const username = fragment.get("username");
    const rnbUserId = fragment.get("rnbUserId");
    user = { username, rnbUserId };
}

if (user) {
    // logged in logic
} else {
    // logged out logic
}

function auth() {
    fetch('https://app-name.netlify.app/.netlify/functions/auth');
}
```

### React
```js
const rallyAuth = {
    isAuthenticated: false,
    user: null,
    init() { },
    auth() {
        fetch('https://app-name.netlify.app/.netlify/functions/auth');
    },
    logout() {
        window.location.href= '/';
    },
}

export default rallyAuth
```

```js
import { useEffect, useState } from 'react';
import rallyAuth from '../rallyAuth';

const Page = () => {
    let [isAuth, setIsAuth] = useState(rallyAuth.isAuthenticated);
    let [user, setUser] = useState(null);

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    window.location.hash = "";
    history.pushState('', document.title, `${window.location.pathname}${window.location.search}`)

    if (fragment.has("username")) {
        const username = fragment.get("username");
        const rnbUserId = fragment.get("rnbUserId");
        setUser({ username, rnbUserId });
        setIsAuth(!!username);
    }

    const login = () => {
        rallyAuth.auth();
    }

    const logout = () => {
        rallyAuth.logout();
    }

    //useEffect(() => {}, [isAuth]);

    return (
        <>
        {isAuth ? (
            <div>
                You are logged in!
                {user && <>Welcome {user?.username}!</>}
            </div>
            <button onClick={logout}>Log out</button>
        ) : (
            <button onClick={login}>Log in with Rally</button>
        )}
        </>
    );
};

export default Page;
```