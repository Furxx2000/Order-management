# 前端面試作業 L1

##### 技術規範：

- 不限制使用框架與 CSS
- 繳交方式：完整專案原始碼 Github 連結、README.md

---

## 題目一：待辦事項列表 Debug 與重構

> ＊此題只需邏輯，無需 UI 畫面設計 (使用提供的 HTML 結構即可)

### 功能需求說明

**基本功能：**

1. **新增待辦事項**：使用者在輸入框輸入文字後，點擊「新增」按鈕，項目會出現在列表中。
2. **顯示列表**：所有待辦事項以清單方式顯示。
3. **刪除項目**：每個項目旁邊有「刪除」按鈕，點擊後該項目從列表中移除。
4. **標記完成**：點擊待辦事項文字可以切換完成/未完成狀態，完成的項目會加上刪除線。

**預期行為：**

- 新增空白項目時應該阻止並提示使用者。
- 新增成功後輸入框應該清空。
- 刪除項目時應該同時從畫面和資料中移除。
- 完成狀態可以重複切換。

### 問題程式碼 (參考)

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .completed {
        text-decoration: line-through;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <h2>我的待辦事項</h2>
      <input id="input" type="text" placeholder="輸入待辦事項" />
      <button onclick="add()">新增</button>
      <ul id="list"></ul>
    </div>
    <script>
      var todos = [];
      var input = document.getElementById('input');
      function add() {
        var value = input.value;
        todos.push(value);
        var li = document.createElement('li');
        li.innerHTML = value + '<button onclick="delete()">刪除</button>';
        document.getElementById('list').appendChild(li);
        input.value = '';
      }
      function delete() {
        // TODO: 實作刪除功能
      }
      // TODO: 實作完成功能
    </script>
  </body>
</html>
```

---

## 題目二：陣列資料處理與邏輯思考

> ＊此題只需邏輯，無需 UI 畫面

**情境說明：** 你收到一份使用者訂單資料，用於後台管理介面顯示。

**訂單資料 (orders)：**
(請參考 `userOrders-processing.js` 中的 `orders` 陣列)

**狀態說明：**

- **status**: `pending` (待處理) | `processing` (處理中) | `completed` (已完成) | `cancelled` (已取消)
- **paymentStatus**: `pending` (待付款) | `paid` (已付款) | `refunded` (已退款)
- **deliveryStatus**: `pending` (待出貨) | `preparing` (準備中) | `shipping` (配送中) | `delivered` (已送達) | `cancelled` (已取消)

### 任務要求

**第一部分：基本統計**

1. 計算每個使用者的總消費金額（只計算 `status: 'completed'` 且 `paymentStatus: 'paid'` 的訂單）。
2. 找出消費金額最高的使用者。
3. 計算整體訂單的完成率（`completed` 訂單數 / 總訂單數）。

**第二部分：進階分析** 4. 找出所有「已付款但尚未送達」的訂單（`paymentStatus: 'paid'` 且 `deliveryStatus` 不是 `'delivered'`）。 5. 統計各配送狀態的訂單數量和金額。 6. 找出「異常訂單」：狀態不合理的訂單。

- 例如：`status: 'completed'` 但 `deliveryStatus` 不是 `'delivered'`
- 或：`paymentStatus: 'pending'` 但 `deliveryStatus` 是 `'shipping'`

**預期輸出格式：**

```javascript
// 第一部分
{
  userTotals: {
    'Alice': 2300,
    'Bob': 3300,
    // ...
  },
  topUser: { name: 'Bob', total: 3300 },
  completionRate: 0.5 // 50%
}

// 第二部分
{
  paidButNotDelivered: [
    { id: 2, user: 'Bob', amount: 2300, deliveryStatus: 'shipping', ... },
    { id: 6, user: 'Alice', amount: 4500, deliveryStatus: 'preparing', ... }
  ],
  deliveryStats: {
    'delivered': { count: 3, totalAmount: 5500 },
    'shipping': { count: 1, totalAmount: 2300 },
    'preparing': { count: 1, totalAmount: 4500 },
    // ...
  },
  anomalies: [
    { id: 7, reason: 'pending payment but already shipping', ... }
  ]
}
```

---

## 題目三：訂單管理系統 - 列表與互動功能

> ＊此題需要 UI 畫面進行操作

### 功能需求說明

開發一個訂單管理後台介面，包含以下功能：

**核心功能：**

1. **訂單列表顯示**：以表格形式呈現所有訂單。
2. **搜尋功能**：可依使用者名稱或訂單編號搜尋。
3. **分頁功能**：每頁顯示 5 筆資料。
4. **狀態更新**：可以更新訂單的配送狀態。

**訂單資料：** 利用第二題的訂單資料 (`orders`)。

### UI 設計要求

**列表顯示欄位：**

- 訂單編號 (ID)
- 使用者名稱 (User)
- 訂單金額 (Amount) - 格式化為貨幣格式 (NT$ 1,500)
- 訂單狀態 (Status) - 用不同顏色標示
- 付款狀態 (Payment Status)
- 配送狀態 (Delivery Status) - 下拉選單可更新
- 訂單日期 (Date)

**狀態顏色標示：**

- **訂單狀態 (status):**
  - `pending`: 黃色 (#FCD34D)
  - `processing`: 藍色 (#60A5FA)
  - `completed`: 綠色 (#4ADE80)
  - `cancelled`: 紅色 (#F87171)
- **付款狀態 (paymentStatus):**
  - `pending`: 橘色 (#FB923C)
  - `paid`: 綠色 (#4ADE80)
  - `refunded`: 灰色 (#9CA3AF)

**配送狀態選項：**

- `pending` (待出貨)
- `preparing` (準備中)
- `shipping` (配送中)
- `delivered` (已送達)
- `cancelled` (已取消)

### 任務要求

**第一階段：列表顯示 (15 分鐘)**

1. 建立訂單列表的 HTML 結構（使用 table 或其他適合的方式）。
2. 將訂單資料渲染到畫面上。
3. 實作狀態顏色標示。
4. 金額格式化（加上千分位逗號和貨幣符號）。

**預期畫面：**

```
訂單管理系統
搜尋: [_____________] 🔍

| 訂單編號 | 使用者 | 金額      | 訂單狀態    | 付款狀態 | 配送狀態     | 日期       |
| -------- | ------ | --------- | ----------- | -------- | ------------ | ---------- |
| 1        | Alice  | NT$ 1,500 | [completed] | [paid]   | [delivered]  | 2024-11-01 |
| 2        | Bob    | NT$ 2,300 | [pending]   | [paid]   | [shipping]   | 2024-11-03 |

...
顯示第 1-5 筆，共 10 筆 [上一頁] 1 [下一頁]
```

**功能細項：**

- **搜尋功能**：實作即時搜尋功能（輸入時即時過濾），部分符合即可（例如搜尋 "Al" 可以找到 "Alice"）。
- **狀態規則**：
  - 如果訂單狀態是 `cancelled`，配送狀態只能是 `cancelled`。
  - 如果付款狀態是 `pending`，配送狀態不能更新為 `shipping` 或 `delivered`。

### 進階挑戰（加分項）

1. **排序功能**：點擊表頭可以排序（金額、日期）。
2. **批次操作**：可以勾選多個訂單，批次更新狀態。
3. **篩選功能**：可以按訂單狀態、付款狀態篩選。
4. **統計資訊**：顯示當前搜尋結果的統計（總金額、各狀態數量）。
5. **RWD**：手機版的表格呈現方式。
