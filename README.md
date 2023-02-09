# hahow-get-heroes-api
本專案為hahow所提供的練習專案，可以取得所有heroes或是個別hero的資料，如果提供正確的name與password則可以取得更完整的資訊。

## 專案設定(利用終端機)
1. 下載本專案到本地
```
git clone https://github.com/Emily81926/hahow-get-heroes-api.git
```
2. 進入本專案資料夾
```
cd hahow-get-heroes-api
```
3. 安裝所需套件
```
 npm install
```
4. 建立`.env`檔案並設定環境參數(`.env.example`檔案內有實例)
5. 下載並啟動Redis（參考下方Redis下載、啟動及查找資料）
6. 啟動伺服器
```
npm run dev  

nodemon app.js // windows使用者使用這行
```
7. 若看到以下字串即代表成功啟動
`This server is running on port 3000`

8. 若看到以下字串代表成功將資料存進redis
```
heroes資料已放進redis
single hero資料已放進redis
single hero profile 資料已放進redis
all hero profile 資料已放進redis
```

### 執行測試(利用終端機)
1. 測試
```
npm run test
```
2. 若看到以下資訊代表測試正在進行
```
This server is running on port 3000


  get all heroes basic request
    ✔ should get 200 and heroes list (38ms)

  get all heroes authenticated request
    name and password correct
      ✔ should get 200 and profile
    name or password wrong
      ✔ should get 401
    invalid request framing
      ✔ should get 400
   .
   .
   .
```

## Redis下載、啟動及查找資料
### Redis 安裝並啟動(利用終端機)`以macOS為例`
[若非使用macOS，按此查找該作業系統之參考文件](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)

1. 確認本機是否有安裝Homebrew
```
brew --verson
```
2. 確認有Homebrew，安裝Redis
```
brew install redis
```
3. 下載完畢，啟動Redis
```
redis-server
```
4. 如果有跑出以下資訊，表示redis啟動成功
```
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 7.0.8 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                  
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 886
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           https://redis.io       
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

```

### Redis檔案查找(利用終端機)

1. Redis成功啟動，連接Redis內部
```
redis-cli
```
2. 查找Redis有哪些資料
```
key *
```
3. 查找成功會看到以下keys
```
 1) "heroes/1/profiles"
 2) "heroes/2"
 3) "heroes/2/profiles"
 4) "heroes/profiles"
 5) "heroes/3/profiles"
 6) "heroes/4/profiles"
 7) "heroes/4"
 8) "heroes/1"
 9) "heroes/3"
10) "heroes"
```
4. 查看key為"heroes"的檔案
```
get "heroes"
```

5. 清空redis內部資料
```
flushall
```

### 取得同一資料的API及Redis的key對照表
* 未經過Authenticated

|        | API        | Redis key |
| ------------- |:-------------:| -----:|
| 1     | [GET] /heroes      |  “heroes” |
| 2       | [GET] /heroes/1      |    “heroes/1” |
| 3       | [GET] /heroes/2      |    “heroes/2” |
| 4       | [GET] /heroes/3      |    “heroes/3” |
| 5       | [GET] /heroes/4      |    “heroes/4” |

* Authenticated

|        | API        | Redis key |
| ------------- |:-------------:| -----:|
| 1     | [GET] /heroes      |  “heroes/profiles” |
| 2       | [GET] /heroes/1      |    “heroes/1/profiles” |
| 3       | [GET] /heroes/2      |    “heroes/2/profiles” |
| 4       | [GET] /heroes/3      |    “heroes/3/profiles” |
| 5       | [GET] /heroes/4      |    “heroes/4/profiles” |

## 專案架構

### 專案架構圖
如圖

![image](https://github.com/Emily81926/hahow-get-heroes-api/blob/ef886ab79c0bb292d93c7a42a08e33c2fb4d1681/%E5%B0%88%E6%A1%88%E6%9E%B6%E6%A7%8B%E5%9C%96.jpeg)

#### Apps
> 專案的主程式，內部引用專案中需要的套件及模組。當接收到request時，會分派到routes。

Routes 
> 當接收到request，會將request分配到對應的router，並分派到對應的controller。

Controllers
> 當controller接收到request，會引用所需要的service。

Services
> 主要的商業邏輯寫在service中，接收到controller的request，會依照撰寫的邏輯到models取用所需的資料，並回傳給controller。

Models
> 資料儲存區。當service發送request，models將相對應的資料返回service。
> 在此中案中主要資料索取區為 `heroData.js`。
> `RedisData.js` 功能為當server一啟動，會自動呼叫所有API，並將data儲存在redis中供快速取用。

<br />

### 使用第三方library或套件
* Express

> Express 為提供給Nodejs所使用之框架，可以幫助開發者快速建造網頁應用程式及API。 Nodejs有內建的http module也可以建構出web server，但是程式碼較為複雜。如果應用express框架則可以運用內部的 `router.get` 等方法快速建構出Web Server。

* Axios

> Axios 套件可以協助開發者達成傳送請求給後端的功能。Axios 用Promise進行封裝，解決Ajax 的回撥地獄的狀況，且其功能相當完整，除了發送請求，還可以取消請求、進度處理、超時處理等等功能。

* Dotenv

> dotenv是一個npm 套件，協助開發者設定環境變數，將敏感資訊儲存在 `.env`，並用 `process.env` 的方式引用在專案中。本專案有用到Hahow提供的API、驗證的name及password等資訊，其他專案則會將secret等資訊放dotenv。

* Redis

> Redis 是一個以記憶體為主進行存取的資料庫，常常被用在需要快取（Cache）一些資料的場合，可以減輕許多後端資料庫的壓力。其儲存方式為key-value，本專案中請求資料需要呼叫API，也會需要將資料進行組合，花費較多時間提取資料，因此運用Redis加速資料提取的速度。

* Bluebird

> bluebird是一個JavaScript的promise library，可以使用 `promisifyAll` 將其他node module變成非同步的方式來使用。本專案將引用的Redis模組進行promisify，確認每一個API呼叫都會執行完回傳資料，並放入Redis database中。

* Mocha

> Mocha 是JavaScript unit test 的框架，可以快速為開發者建構出unit test架構，書寫方式相當口語易懂（describe, context, it） ，使用簡易的 `mocha test.js` 指令可以完成測試，在console顯示清楚的測試結果，如果測試沒有通過也有提供錯誤原因。

* Chai

> Chai是一種跟Mocha相配合的斷言庫，用來判斷驗證結果是否符合預期，且寫法相當白話，例如expect, should等，比Mocha內建的assert語法更為易懂。

<br />
<br />

### 程式碼註解原則
* 解釋程式碼的撰寫目的

> 在某一區塊的程式碼書寫該程式碼之功能，及為什麼要書寫這一塊程式碼，減少他人閱讀程式碼的時間，以及讓該程式碼更容易維護

* 解釋特殊處理的程式碼之原因

> 當某區塊的程式碼為處理特殊情況，利用註解說明該程式碼的功能，可以快速理解該程式碼的用途

<br />
<br />

## 專案過程

### 邊際情況處理
* [GET] `/heroes/:heroId` 如果沒有該heroId，則要回傳404， "cannot find the data"

>該部分測試檔有完成，但是加上Redis之後該功能需要再處理相關bug

* Authenticated List Heroes [GET] `/heroes` 新增 *如果只有輸入Name或是Password* 的狀況，回傳401及 "name or password is incorrect"

<br />

### 遇到的問題及解決方法
1. 需求理解花較多時間

> 問題描述： 理解需求的時候花了一些時間，例如：當user輸入name跟password沒有驗證成功的話，是要提供「未驗證」的資料，還是回覆錯誤的資料呢？

`解決方式` 
  理解需求的部分，先充分將自己不懂的地方記錄下來，Hahow提供slack可以詢問。待需求都確定後再進行開發，不然會花更多時間改功能。

<br />

2. API重複呼叫及資料取得時間較長

> 問題描述： 發送請求的時候，都要重新呼叫一次API以取得資料。呼叫 Authenticated [GET] /heroes 時會花非常多時間在呼叫API以及組裝資料。

`解決方式` 
  利用Redis，將呼叫過的資料放進cache裡，當呼叫相同的API時直接從Redis中拿取資料以縮短時間。 但是只有在呼叫過的API才會將資料放進Redis，未呼叫過的API資料取得時間仍然很長。
  所以就設定 `當server啟動後，自動呼叫所有API將資料放進Redis`。當有請求發送時，可以快速從Redis中取得需要的資料。

<br />

3. 需要在redis內部使用async await方法

> 問題描述：server啟動後需要自動呼叫所有API，並將資料放進Redis。需要確認所有的資料都有放進去Redis，才不會在呼叫的Redis的時候找不到資料。

`解決方式` 
  運用bluebird套件，用promisifyAll方法打包Redis的async await程式碼。並使用getAsync以及setAsync存取及取得Redis資料，可以確認所有資料都有確實放進Redis。
  
  <br />
  
4. 邊境狀況處理

> 問題描述：設定authenticate的方式時，如果只確認使用者有提供Name就進入驗證的話，當使用者沒有提供Name，但是有提供Password，會直接當成使用者沒有要驗證，而給予hero基本資料。

`解決方式` 
  在驗證的地方從原本的 `if(req.headers[“name”])` 加上條件 `req.headers[“password”]`，如果其中一個參數存在都要進入authenticate的環節，就會取得200或是401。
  
<br />

5. 404邊境狀況處理

> 問題描述： 當要取用單一hero的資料時，輸入heroId做為參數。但是如果該heroId不存在，則要回覆404 not found資訊。

`解決方式` 
  在controller的地方加上輸入錯誤的hero ID，會到catch error並回傳404及錯誤訊息。但是使用Redis進行優化的時候，檔案取用時出現問題，拿不到error的資訊，目前還在修bug。

<br />

6. 重構花了一些時間

> 問題描述：專案功能完成後，發現程式碼重複的程式碼以及功能很多，導致程式碼閱讀上會維護上較冗長。

`解決方式` 
  運用helpers將axios的get request 功能寫成一個獨立的function,當要使用的時候再引用，還有在set redis的部分，也另外寫成一個function，程式碼變成較易懂且易維護。



