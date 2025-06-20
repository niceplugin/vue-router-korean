# 다양한 히스토리 모드 %{#different-history-modes}%

<VueSchoolLink
  href="https://vueschool.io/lessons/history-mode"
  title="Hash 모드와 HTML5 모드의 차이점 알아보기"
/>

라우터 인스턴스를 생성할 때 사용하는 `history` 옵션을 통해 다양한 히스토리 모드 중에서 선택할 수 있습니다.

## HTML5 모드 %{#html5-mode}%

HTML5 모드는 `createWebHistory()`로 생성하며, 권장되는 모드입니다:

```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

`createWebHistory()`를 사용할 때, URL은 "정상적으로" 보입니다. 예: `https://example.com/user/id`. 아름답죠!

하지만 여기서 문제가 발생합니다. 우리의 앱은 싱글 페이지 클라이언트 사이드 앱이기 때문에, 서버 설정이 제대로 되어 있지 않으면 사용자가 브라우저에서 `https://example.com/user/id`에 직접 접근할 경우 404 에러가 발생합니다. 보기 안 좋죠.

걱정하지 마세요: 이 문제를 해결하려면 서버에 간단한 catch-all 폴백 라우트를 추가하면 됩니다. URL이 정적 자산과 일치하지 않으면, 앱이 위치한 동일한 `index.html` 페이지를 제공해야 합니다. 다시 아름답게 해결됩니다!

## 해시 모드 %{#hash-mode}%

해시 히스토리 모드는 `createWebHashHistory()`로 생성합니다:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

이 모드는 실제 URL 앞에 해시 문자(`#`)를 사용하여 내부적으로 전달합니다. 이 URL의 해당 부분은 서버로 전송되지 않기 때문에, 서버 차원에서 특별한 처리가 필요하지 않습니다. **하지만 SEO에 좋지 않은 영향을 미칩니다**. 만약 이것이 걱정된다면, HTML5 히스토리 모드를 사용하세요.

## 메모리 모드 %{#memory-mode}%

메모리 히스토리 모드는 브라우저 환경을 가정하지 않으므로 URL과 상호작용하지 않으며 **초기 내비게이션을 자동으로 트리거하지도 않습니다**. 이로 인해 Node 환경과 SSR에 완벽하게 적합합니다. `createMemoryHistory()`로 생성하며, **`app.use(router)` 호출 후 초기 내비게이션을 직접 푸시해야 합니다**.

```js
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    //...
  ],
})
```

권장되지는 않지만, 이 모드를 브라우저 애플리케이션 내에서 사용할 수도 있습니다. 하지만 **히스토리가 없으므로** _뒤로_ 또는 _앞으로_ 이동할 수 없다는 점에 유의하세요.

## 예시 서버 설정 %{#example-server-configurations}%

**참고**: 아래 예시들은 앱을 루트 폴더에서 제공한다고 가정합니다. 하위 폴더에 배포하는 경우 [Vue CLI의 `publicPath` 옵션](https://cli.vuejs.org/config/#publicpath)과 관련된 [`base` 라우터 속성](https://router.vuejs.org/api/interfaces/Router.html#createWebHistory)을 사용해야 합니다. 또한 아래 예시에서 루트 폴더 대신 하위 폴더를 사용하도록 조정해야 합니다(예: `RewriteBase /`를 `RewriteBase /name-of-your-subfolder/`로 교체).

### Apache %{#apache}%

```
<IfModule mod_negotiation.c>
  Options -MultiViews
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

`mod_rewrite` 대신 [`FallbackResource`](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#fallbackresource)를 사용할 수도 있습니다.

### nginx %{#nginx}%

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### 네이티브 Node.js %{#native-nodejs}%

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http
  .createServer((req, res) => {
    fs.readFile('index.html', 'utf-8', (err, content) => {
      if (err) {
        console.log('"index.html" 파일을 열 수 없습니다.')
      }

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      res.end(content)
    })
  })
  .listen(httpPort, () => {
    console.log('서버가 다음에서 대기 중입니다: http://localhost:%s', httpPort)
  })
```

### Node.js와 Express %{#express-with-nodejs}%

Node.js/Express의 경우, [connect-history-api-fallback 미들웨어](https://github.com/bripkens/connect-history-api-fallback) 사용을 고려하세요.

### 인터넷 정보 서비스 (IIS) %{#internet-information-services-iis}%

1. [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite) 설치
2. 사이트의 루트 디렉터리에 다음과 같이 `web.config` 파일 생성:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Caddy v2 %{#caddy-v2}%

```
try_files {path} /
```

### Caddy v1 %{#caddy-v1}%

```
rewrite {
    regexp .*
    to {path} /
}
```

### Firebase 호스팅 %{#firebase-hosting}%

`firebase.json`에 다음을 추가하세요:

```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Netlify %{#netlify}%

배포 파일에 포함되는 `_redirects` 파일을 생성하세요:

```
/* /index.html 200
```

vue-cli, nuxt, vite 프로젝트에서는 이 파일이 보통 `static` 또는 `public` 폴더에 위치합니다.

문법에 대한 자세한 내용은 [Netlify 문서](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)에서 확인할 수 있습니다. 또한 [netlify.toml 파일 생성](https://docs.netlify.com/configure-builds/file-based-configuration/)을 통해 _리디렉션_을 다른 Netlify 기능과 결합할 수도 있습니다.

### Vercel %{#vercel}%

프로젝트의 루트 디렉터리에 다음과 같이 `vercel.json` 파일을 생성하세요:

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

## 주의사항 %{#caveat}%

여기에는 주의할 점이 있습니다: 이제 서버는 더 이상 404 에러를 보고하지 않습니다. 모든 존재하지 않는 경로가 `index.html` 파일을 제공하게 되기 때문입니다. 이 문제를 해결하려면, Vue 앱 내에서 catch-all 라우트를 구현하여 404 페이지를 표시해야 합니다:

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)', component: NotFoundComponent }],
})
```

또는, Node.js 서버를 사용하는 경우, 서버 측에서 라우터를 사용하여 들어오는 URL을 매칭하고, 일치하는 라우트가 없으면 404로 응답하는 폴백을 구현할 수 있습니다. 자세한 내용은 [Vue 서버 사이드 렌더링 문서](https://vuejs.org/guide/scaling-up/ssr.html)를 참고하세요.