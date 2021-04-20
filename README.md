# commits

## initial project settings

- `npm install express`
- `npm install -D @types/express @types/node nodemon typescript`
- `tsc --init`
- `package.json`, `.gitignore`, `tsconfig.json`, `src/app.ts` 작성

## add wrapping and initialization function

- async handler를 위한 wrapping function 작성
- `app.listen`에 initialize function 붙임

## add cors & sqlite3

- `npm install cors sqlite3`
- `npm install -D @types/cors @types/sqlite3`
- `src/app.ts`에서 cors middleware 추가

## change tsconfig rootDir

- `tsconfig.json`에서 `rootDir` 변경

## create database

- initialize function에 db파일 및 table 생성 추가
- `.gitignore`에 db 파일 추가

## parse body
- `req.body` parse 기능 추가

## create diary APIs
- diary 관련 router(logic을 겸함), database, interface 추가

## create public directory
- 정적 파일 보관 디렉토리 추가
- `.gitignore`에 해당 디렉토리 추가

## install multer
- `npm install multer`
- `npm install -D @types/multer`
