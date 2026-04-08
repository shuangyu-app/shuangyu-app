"use client";
import { useState, useEffect, useRef } from "react";

// Typography tokens — use these everywhere, never raw font strings
const FONT = {
  ui:    "'Inter', 'Noto Sans SC', sans-serif",   // all UI: buttons, labels, prices, descriptions
  brand: "'Noto Serif SC', serif",                // brand name 双瑜记 ONLY
};

// ─── DATA ───────────────────────────────────────────────────────────────────

const BRAND = {
  name: "双瑜记",
  tagline: "正宗麻辣烫 · 现点现烫",
  address: "A83A, Jalan Tuanku 2, Taman Salak South, 57100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
  addressCN: "吉隆坡 · Taman Salak South",
  mapUrl: "https://maps.google.com/?q=A83A+Jalan+Tuanku+2+Taman+Salak+South+57100+Kuala+Lumpur",
  hours: "每日 10:00AM - 10:00PM",
  hoursEn: "Daily 10:00AM - 10:00PM",
};

const PRESET_BOWLS = [
  {
    id: "p1",
    name: "鸡肉麻辣烫", nameEn: "Chicken Mala Tang",
    desc: "嫩滑鸡肉 · 宽粉 · 时蔬三样 · 麻辣汤底",
    descEn: "Tender chicken · wide glass noodles · 3 veg · spicy broth",
    price: 18.9, tag: "热卖", tagEn: "Popular", img: "🍜",
    ingredients: ["鸡腿肉", "宽粉", "白菜", "木耳", "豆腐皮"], spicy: 3,
  },
  {
    id: "p2",
    name: "牛肉麻辣烫", nameEn: "Beef Mala Tang",
    desc: "薄切牛肉 · 细面 · 时蔬三样 · 浓郁麻辣",
    descEn: "Thinly sliced beef · thin noodles · 3 veg · rich mala broth",
    price: 22.9, tag: "招牌", tagEn: "Signature Pick", img: "🥩",
    ingredients: ["牛肉片", "细面", "金针菇", "腐竹", "油麦菜"], spicy: 4,
  },
  {
    id: "p3",
    name: "素菜麻辣烫", nameEn: "Veggie Mala Tang",
    desc: "五样时蔬 · 宽粉 · 清汤或麻辣可选",
    descEn: "5 seasonal vegetables · wide noodles · clear or spicy broth",
    price: 14.9, tag: "健康", tagEn: "Healthy", img: "🥬",
    ingredients: ["白菜", "木耳", "金针菇", "豆腐", "西兰花"], spicy: 0,
  },
];

const PREMIUM_BOWLS = [
  {
    id: "pr1",
    name: "双瑜招牌锅", nameEn: "Shuang Yu Signature Pot",
    desc: "牛肉 + 虾滑 + 蟹棒 · 双拼底料 · 份量加大",
    descEn: "Beef + shrimp paste + crab sticks · double broth · generous portion",
    price: 35.9, tag: "人气No.1", tagEn: "No.1 Pick", img: "🦐",
    ingredients: ["牛肉片", "虾滑", "蟹棒", "宽粉", "时蔬四样"], spicy: 3,
  },
  {
    id: "pr2",
    name: "海鲜至尊锅", nameEn: "Supreme Seafood Pot",
    desc: "虾滑 + 鱼豆腐 + 蟹肉棒 · 番茄汤底 · 鲜甜浓郁",
    descEn: "Shrimp paste + fish tofu + crab sticks · tomato broth · naturally sweet",
    price: 38.9, tag: "限量供应", tagEn: "Limited", img: "🦞",
    ingredients: ["虾滑", "鱼豆腐", "蟹肉棒", "米粉", "时蔬四样"], spicy: 0,
  },
];

const ADDONS = [
  { id: "a1", name: "溏心蛋", nameEn: "Soft-boiled Egg", price: 2.5, emoji: "🥚" },
  { id: "a2", name: "卤蛋", nameEn: "Braised Egg", price: 2.0, emoji: "🥚" },
  { id: "a3", name: "加量牛肉", nameEn: "Extra Beef", price: 6.0, emoji: "🥩" },
  { id: "a4", name: "加量鸡肉", nameEn: "Extra Chicken", price: 4.5, emoji: "🍗" },
  { id: "a5", name: "虾滑丸", nameEn: "Shrimp Paste Ball", price: 5.0, emoji: "🍢" },
  { id: "a6", name: "芝士豆腐", nameEn: "Cheese Tofu", price: 3.5, emoji: "🧀" },
];

const NOODLES = [
  { id: "n1", name: "宽粉", nameEn: "Wide Glass Noodles", desc: "Q弹顺滑", descEn: "Smooth & springy" },
  { id: "n2", name: "细面", nameEn: "Thin Wheat Noodles", desc: "劲道入味", descEn: "Firm & flavourful" },
  { id: "n3", name: "米粉", nameEn: "Rice Vermicelli", desc: "软糯清爽", descEn: "Soft & light" },
  { id: "n4", name: "乌冬", nameEn: "Udon", desc: "厚实饱腹", descEn: "Thick & filling" },
];

const TOPPINGS = {
  蔬菜类: [
    { id: "t1", name: "白菜", nameEn: "Cabbage", price: 0 },
    { id: "t2", name: "木耳", nameEn: "Wood Ear Fungus", price: 0 },
    { id: "t3", name: "金针菇", nameEn: "Enoki Mushrooms", price: 0 },
    { id: "t4", name: "西兰花", nameEn: "Broccoli", price: 0 },
    { id: "t5", name: "油麦菜", nameEn: "Romaine Lettuce", price: 0 },
    { id: "t6", name: "莲藕片", nameEn: "Lotus Root", price: 1.0 },
  ],
  肉类: [
    { id: "t7", name: "牛肉片", nameEn: "Beef Slices", price: 4.0 },
    { id: "t8", name: "鸡腿肉", nameEn: "Chicken Thigh", price: 3.0 },
    { id: "t9", name: "猪肉片", nameEn: "Pork Slices", price: 3.0 },
    { id: "t10", name: "午餐肉", nameEn: "Luncheon Meat", price: 2.5 },
  ],
  "丸类 / 加工类": [
    { id: "t11", name: "鱼丸", nameEn: "Fish Balls", price: 1.5 },
    { id: "t12", name: "虾滑", nameEn: "Shrimp Paste", price: 3.5 },
    { id: "t13", name: "蟹棒", nameEn: "Crab Sticks", price: 2.0 },
    { id: "t14", name: "鱼豆腐", nameEn: "Fish Tofu", price: 2.0 },
  ],
  豆制品: [
    { id: "t15", name: "豆腐", nameEn: "Tofu", price: 0 },
    { id: "t16", name: "腐竹", nameEn: "Tofu Skin Roll", price: 0 },
    { id: "t17", name: "豆腐皮", nameEn: "Tofu Sheet", price: 0 },
    { id: "t18", name: "油豆腐", nameEn: "Fried Tofu", price: 1.0 },
  ],
};

const SOUPS = [
  { id: "s1", name: "麻辣", nameEn: "Mala Spicy", desc: "花椒麻香 · 辣而不燥", descEn: "Numbing & spicy · bold but balanced", emoji: "🌶️" },
  { id: "s2", name: "番茄", nameEn: "Tomato", desc: "鲜甜酸香 · 老少皆宜", descEn: "Fresh, tangy & naturally sweet", emoji: "🍅" },
  { id: "s3", name: "清汤", nameEn: "Clear Broth", desc: "原味清爽 · 养生之选", descEn: "Light & clean · great for all", emoji: "🫧" },
];

const BASE_CUSTOM_PRICE = 13.9;
const FREE_TOPPINGS = 5;

// ─── 麻辣香锅 DATA ────────────────────────────────────────────────────────────

const XIANGUO_PORTIONS = [
  { id: "xp1", name: "单人份", nameEn: "Solo", desc: "适合1人", descEn: "Serves 1", price: 22.9 },
  { id: "xp2", name: "双人份", nameEn: "For 2", desc: "适合2人", descEn: "Serves 2", price: 38.9 },
  { id: "xp3", name: "豪华份", nameEn: "Feast", desc: "适合3–4人", descEn: "Serves 3–4", price: 58.9 },
];

const XIANGUO_SPICE = [
  { id: "xs1", name: "不辣", nameEn: "No Spice", emoji: "😊" },
  { id: "xs2", name: "微辣", nameEn: "Mild", emoji: "🌶️" },
  { id: "xs3", name: "中辣", nameEn: "Medium", emoji: "🌶️🌶️" },
  { id: "xs4", name: "重辣", nameEn: "Hot", emoji: "🌶️🌶️🌶️" },
];

const XIANGUO_ADDONS = [
  { id: "xa1", name: "加牛肉", nameEn: "+ Beef", price: 6.0, emoji: "🥩" },
  { id: "xa2", name: "加虾", nameEn: "+ Shrimp", price: 6.0, emoji: "🍤" },
  { id: "xa3", name: "加蔬菜", nameEn: "+ Veggies", price: 3.0, emoji: "🥬" },
  { id: "xa4", name: "加豆腐", nameEn: "+ Tofu", price: 3.0, emoji: "🧀" },
];

// ─── 小吃 DATA ────────────────────────────────────────────────────────────────

const SNACKS = [
  { id: "sn1", name: "酱香饼", nameEn: "Sauce Flatbread", price: 8.0, img: "🫓", tag: "热卖", tagEn: "Popular" },
  { id: "sn2", name: "烤冷面", nameEn: "Grilled Cold Noodles", price: 7.9, img: "🍝", tag: null },
  { id: "sn3", name: "炸鸡排", nameEn: "Fried Chicken Cutlet", price: 8.9, img: "🍗", tag: "招牌", tagEn: "Signature Pick" },
  { id: "sn4", name: "章鱼小丸子", nameEn: "Takoyaki", price: 7.9, img: "🐙", tag: null },
  { id: "sn5", name: "豆腐脑", nameEn: "Silken Tofu", price: 4.9, img: "🥣", tag: null },
];

// ─── I18N ─────────────────────────────────────────────────────────────────────

const T = {
  zh: {
    categories: { mlt: "麻辣烫", xlg: "麻辣香锅", xc: "小吃" },
    mlt_tabs: { classic: "经典款", custom: "自选锅", premium: "精品锅" },
    classic_hint: "不想纠结？点这个就对",
    custom_title: "你说了算",
    custom_sub: "主食、配料、汤底，一步一步来\n几秒就好",
    custom_start: "开始搭配 →",
    premium_title: "精品系列",
    premium_sub: "顶级食材 · 偶尔犒劳一下自己",
    xlg_title: "麻辣香锅",
    xlg_sub: "固定套餐 · 选份量选辣度",
    xlg_step1: "选份量",
    xlg_step2: "选辣度",
    xlg_step3: "加料（可选）",
    xlg_multi: "可多选",
    xlg_add: "加入购物车",
    xlg_next: "下一步 →",
    xlg_back: "上一步",
    snacks_hint: "简单快手，一口一个",
    add: "+ 加入",
    added: "已加入 ✓",
    pickup_hint: "仅限自取 · 可自行安排 Lalamove / Grab 代取",
    self_pickup: "仅限自取",
    again: "再来一碗",
    // builder
    builder_title: "自选锅 · 自己配",
    builder_step_label: (s, t) => `步骤 ${s} / ${t}`,
    builder_step1: "选主食",
    builder_step2: "选配料",
    builder_step3: "选汤底",
    builder_selected: "已选",
    builder_count: (n) => `已选 ${n} 样 · 部分食材另加价`,
    builder_next: (p) => `下一步 · RM ${p} →`,
    builder_add: (p) => `加入 · RM ${p} →`,
    // addon modal
    addon_modal_sub: "要不要加点料？",
    addon_direct: "直接加入，不加料",
    addon_confirm: (p) => `加入购物车 (RM ${p})`,
    // toppings categories
    tcat_veg: "蔬菜类",
    tcat_meat: "肉类",
    tcat_balls: "丸类 / 加工类",
    tcat_tofu: "豆制品",
    // cart
    cart_title: "购物车",
    cart_count: (n) => `${n} 件`,
    // checkout
    checkout_back: "← 继续点餐",
    checkout_title: "确认订单",
    order_title: "你的选餐",
    expand: "查看详情",
    collapse: "收起",
    addons_label: "加料：",
    location_title: "取餐地点",
    hours_label: "营业时间：",
    show_map: "📍 打开地图导航",
    pickup_note: "到店报订单号取餐",
    contact_title: "你的联系方式",
    name_label: "姓名",
    name_ph: "请输入取餐姓名",
    phone_label: "电话号码",
    phone_ph: "01x-xxxxxxxx",
    err_name: "请输入姓名",
    err_phone: "号码格式不对，再试一次",
    err_time: "请选择取餐时间",
    time_title: "什么时候来",
    date_label: "日期",
    time_label: "时间段（每30分钟）",
    more_slots: "更多 ↓",
    fewer_slots: "收起 ↑",
    payment_title: "付款方式",
    payment_method: "在线支付（FPX / e-wallet）",
    payment_sub: '点击"前往付款"后完成支付',
    amount_label: "应付金额",
    pay_btn: "前往付款 →",
    // payment page
    pay_header: "确认支付",
    pay_order_title: "你的订单",
    pay_subtotal: (n) => `${n} 件`,
    pay_total_label: "合计",
    pay_confirm: "确认支付 →",
    pay_hint: "支付后订单即时确认",
    pay_processing: "马上就好，别走开",
    pay_success: "支付成功",
    pay_success_sub: "正在生成订单，请稍候…",
    pay_pickup: "取餐人：",
    pay_time: "取餐时间：",
    // confirmation
    conf_header: "搞定，等开吃 🍜",
    conf_time_label: "取餐时间",
    conf_punctual: "请准时到店取餐",
    conf_order_no: "订单号",
    conf_copy: "复制",
    conf_copied: "已复制 ✓",
    conf_location: BRAND.name,
    conf_rider: "🛵 如需骑手代取（Lalamove / Grab），请将订单号提供给骑手",
    conf_map: "📍 打开地图导航",
    conf_rider_hint: "💡 如不方便到店，可自行安排 Lalamove / Grab 代取",
    conf_total: "合计",
    conf_again: "再来一单",
    conf_home: "返回首页",
    today: "今天",
    tomorrow: "明天",
  },
  en: {
    categories: { mlt: "Mala Tang", xlg: "Mala Xiang Guo", xc: "Snacks" },
    mlt_tabs: { classic: "Classic", custom: "Build Your Own", premium: "Premium" },
    classic_hint: "Can't decide? These always hit.",
    custom_title: "Your bowl, your rules",
    custom_sub: "Noodles, toppings, broth — sorted in seconds",
    custom_start: "Start Building →",
    premium_title: "Premium",
    premium_sub: "Top ingredients · Treat yourself",
    xlg_title: "Mala Xiang Guo",
    xlg_sub: "Set portions · Pick your heat",
    xlg_step1: "Portion Size",
    xlg_step2: "Spice Level",
    xlg_step3: "Add-ons (optional)",
    xlg_multi: "Pick any",
    xlg_add: "Add to Cart",
    xlg_next: "Next →",
    xlg_back: "Back",
    snacks_hint: "Quick bites to round out your meal",
    add: "+ Add",
    added: "Added ✓",
    pickup_hint: "Self pickup only · You may arrange Lalamove / Grab",
    self_pickup: "Self Pickup",
    again: "One More Bowl",
    // builder
    builder_title: "Build Your Bowl",
    builder_step_label: (s, t) => `Step ${s} of ${t}`,
    builder_step1: "Noodles",
    builder_step2: "Toppings",
    builder_step3: "Broth",
    builder_selected: "Selected",
    builder_count: (n) => `${n} selected · some items are charged extra`,
    builder_next: (p) => `Next · RM ${p} →`,
    builder_add: (p) => `Add to Cart · RM ${p} →`,
    // addon modal
    addon_modal_sub: "Want to add anything extra?",
    addon_direct: "Skip add-ons, just add",
    addon_confirm: (p) => `Add to Cart (RM ${p})`,
    // toppings categories
    tcat_veg: "Vegetables",
    tcat_meat: "Meat",
    tcat_balls: "Balls & Processed",
    tcat_tofu: "Tofu",
    // cart
    cart_title: "Cart",
    cart_count: (n) => `${n} item${n !== 1 ? "s" : ""}`,
    // checkout
    checkout_back: "← Keep Browsing",
    checkout_title: "Your Order",
    order_title: "Your Items",
    expand: "See details",
    collapse: "Hide",
    addons_label: "Add-ons: ",
    location_title: "Pickup Location",
    hours_label: "Hours: ",
    show_map: "📍 Open in Maps",
    pickup_note: "Show your order number at the counter",
    contact_title: "Your Details",
    name_label: "Name",
    name_ph: "Name for pickup",
    phone_label: "Phone Number",
    phone_ph: "01x-xxxxxxxx",
    err_name: "Please enter your name",
    err_phone: "Check your number and try again",
    err_time: "Pick a pickup time",
    time_title: "When are you coming?",
    date_label: "Date",
    time_label: "Time slot (every 30 min)",
    more_slots: "More ↓",
    fewer_slots: "Less ↑",
    payment_title: "Payment",
    payment_method: "Online Payment (FPX / e-wallet)",
    payment_sub: "Tap Pay Now to complete your order",
    amount_label: "Total",
    pay_btn: "Pay Now →",
    // payment page
    pay_header: "Confirm Payment",
    pay_order_title: "Your Order",
    pay_subtotal: (n) => `${n} item${n !== 1 ? "s" : ""}`,
    pay_total_label: "Total",
    pay_confirm: "Confirm Payment →",
    pay_hint: "Order confirmed instantly after payment",
    pay_processing: "Hang on, almost there…",
    pay_success: "Payment Successful",
    pay_success_sub: "Getting your order ready…",
    pay_pickup: "Pickup by: ",
    pay_time: "Pickup time: ",
    // confirmation
    conf_header: "You're all set 🍜",
    conf_time_label: "Pickup Time",
    conf_punctual: "Please arrive on time",
    conf_order_no: "Order No.",
    conf_copy: "Copy",
    conf_copied: "Copied ✓",
    conf_location: BRAND.name,
    conf_rider: "🛵 Sending a rider? Share your order number with them",
    conf_map: "📍 Open in Maps",
    conf_rider_hint: "💡 Can't make it? Arrange a Lalamove / Grab pickup anytime",
    conf_total: "Total",
    conf_again: "Order Again",
    conf_home: "Back to Home",
    today: "Today",
    tomorrow: "Tomorrow",
  },
};

// ─── UTILS ──────────────────────────────────────────────────────────────────

function generateOrderId() {
  return "SYJ-" + Date.now().toString().slice(-4);
}

// Returns all time slots (10:00–21:30, every 30 min) as { value, label } — no disabled logic here
function getAllTimeSlots() {
  const slots = [];
  const start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date();
  end.setHours(21, 30, 0, 0);
  let t = new Date(start);
  while (t <= end) {
    const h = t.getHours().toString().padStart(2, "0");
    const m = t.getMinutes().toString().padStart(2, "0");
    const value = `${h}:${m}`; // 24h internal value
    slots.push({ value });
    t = new Date(t.getTime() + 30 * 60000);
  }
  return slots;
}

// Convert "HH:MM" (24h) to "H:MM AM/PM" for display
function formatTime12h(value) {
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr;
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;
  return `${h}:${m} ${period}`;
}

// Is a slot disabled? Only if selected date is today AND slot time <= now + 30min buffer
function isSlotDisabled(slotValue, selectedDate) {
  const todayValue = new Date().toISOString().split("T")[0];
  if (selectedDate !== todayValue) return false; // future date — all slots open

  const [slotH, slotM] = slotValue.split(":").map(Number);
  const now = new Date();
  const cutoff = new Date(now.getTime() + 30 * 60000); // now + 30 min buffer
  const slotDate = new Date();
  slotDate.setHours(slotH, slotM, 0, 0);
  return slotDate <= cutoff;
}

// Check if today has at least one valid slot (30-min buffer)
function hasValidSlotsToday() {
  const allSlots = getAllTimeSlots();
  const todayValue = new Date().toISOString().split("T")[0];
  return allSlots.some((s) => !isSlotDisabled(s.value, todayValue));
}

function getDateOptions() {
  const opts = [];
  const now = new Date();
  const todayHasSlots = hasValidSlotsToday();
  // Start from i=0 (today) only if there are valid slots; otherwise start from i=1 (tomorrow)
  const startOffset = todayHasSlots ? 0 : 1;
  for (let i = startOffset; i < startOffset + 3; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrowStr = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
    const dStr = d.toISOString().split("T")[0];
    const label =
        dStr === todayStr ? "今天"
        : dStr === tomorrowStr ? "明天"
        : `${d.getMonth() + 1}月${d.getDate()}日`;
      const labelEN =
        dStr === todayStr ? "Today"
        : dStr === tomorrowStr ? "Tomorrow"
        : d.toLocaleDateString("en-MY", { month: "short", day: "numeric" });
      opts.push({ label, labelEN, value: dStr });
  }
  return opts;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function SpicyDots({ level }) {
  return (
    <span style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i <= level ? "#e63946" : "#eee",
            display: "inline-block",
          }}
        />
      ))}
    </span>
  );
}

function Tag({ children, variant = "hot" }) {
  const styles = {
    hot: { background: "#e63946", color: "#fff" },
    gold: { background: "#c9a84c", color: "#fff" },
    green: { background: "#2d6a4f", color: "#fff" },
    outline: { background: "transparent", border: "1px solid #c9a84c", color: "#c9a84c" },
  };
  return (
    <span
      style={{
        ...styles[variant],
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 20,
        letterSpacing: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// ─── FOOD CARD ───────────────────────────────────────────────────────────────

function FoodCard({ item, onAdd, onUpdateQty, onRemove, cartItems = [], isPremium = false, lang = "zh" }) {
  // Find all cart entries for this item
  const matchingCartItems = cartItems.filter((c) => c.id === item.id && !c.isCustom);
  const totalQty = matchingCartItems.reduce((s, c) => s + c.qty, 0);
  const inCart = totalQty > 0;

  // For simple items: one cart entry with no addons — show stepper
  const simpleCartEntry = matchingCartItems.length === 1 && (!matchingCartItems[0].addons || matchingCartItems[0].addons.length === 0)
    ? matchingCartItems[0] : null;

  const accentColor = isPremium ? "#c9a84c" : "#e63946";

  return (
    <>
      <div
        style={{
          background: isPremium ? "linear-gradient(135deg, #1a0a00 0%, #2d1200 100%)" : "#fff",
          border: isPremium ? "1px solid #c9a84c" : "1px solid #f0e6d3",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow: isPremium ? "0 4px 24px rgba(201,168,76,0.18)" : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            height: 120,
            background: isPremium ? "linear-gradient(135deg, #3d1a00, #1a0a00)" : "linear-gradient(135deg, #fff5eb, #ffe0cc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 56, position: "relative",
          }}
        >
          {item.img}
          {item.tag && (
            <div style={{ position: "absolute", top: 8, left: 8 }}>
              <Tag variant={isPremium
                ? (item.tag === "限量供应" ? "hot" : "gold")
                : item.tag === "健康" ? "green"
                : item.tag === "招牌" || item.tag === "人气No.1" ? "gold"
                : "hot"
              }>
                {lang === "en" && item.tagEn ? item.tagEn : item.tag}
              </Tag>
            </div>
          )}
          {item.spicy > 0 && (
            <div style={{ position: "absolute", bottom: 8, right: 8 }}>
              <SpicyDots level={item.spicy} />
            </div>
          )}
          {/* Cart qty badge on image */}
          {inCart && (
            <div style={{
              position: "absolute", top: 8, right: 8,
              background: "#e63946", color: "#fff",
              borderRadius: "50%", width: 22, height: 22,
              fontSize: 11, fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }}>
              {totalQty}
            </div>
          )}
        </div>

        <div style={{ padding: "12px 14px 14px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: isPremium ? "#f5d88a" : "#1a0a00", marginBottom: 4 }}>
            {lang === "en" && item.nameEn ? item.nameEn : item.name}
          </div>
          <div style={{ fontSize: 12, color: isPremium ? "#c9a84c" : "#999", marginBottom: 10, lineHeight: 1.4 }}>
            {lang === "en" && item.descEn ? item.descEn : item.desc}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: isPremium ? "#f5d88a" : "#e63946" }}>
              RM {item.price.toFixed(2)}
            </span>

            {simpleCartEntry ? (
              /* Item in cart: stepper for qty, + 加入 opens modal for a new variation */
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => onUpdateQty(simpleCartEntry.cartId, simpleCartEntry.qty - 1)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `1.5px solid ${accentColor}`, background: "#fff",
                    fontSize: 16, fontWeight: 700, cursor: "pointer",
                    color: accentColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >−</button>
                <span style={{ fontWeight: 900, fontSize: 15, minWidth: 18, textAlign: "center", color: isPremium ? "#f5d88a" : "#1a0a00" }}>
                  {simpleCartEntry.qty}
                </span>
                <button
                  onClick={() => onUpdateQty(simpleCartEntry.cartId, simpleCartEntry.qty + 1)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: accentColor, border: "none",
                    fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >+</button>
              </div>
            ) : (
              /* Instant add — no modal */
              <button
                onClick={() => onAdd({ ...item, addons: [], cartLabel: null })}
                style={{
                  background: accentColor,
                  color: "#fff", border: "none", borderRadius: 24,
                  padding: "7px 16px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", minWidth: 72,
                }}
              >
                {T[lang].add}
              </button>
            )}
          </div>
        </div>
      </div>

    </>
  );
}

// ─── CUSTOM BOWL BUILDER ─────────────────────────────────────────────────────

function CustomBowlBuilder({ onAdd, onClose, lang = "zh" }) {
  const t = T[lang];
  const [step, setStep] = useState(1);
  const [noodle, setNoodle] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [soup, setSoup] = useState(null);

  // Live total: base price + all paid-ingredient prices
  const calcTotal = () => {
    let t = BASE_CUSTOM_PRICE;
    selectedToppings.forEach((top) => (t += top.price));
    return t;
  };

  const toggleTopping = (item) => {
    const exists = selectedToppings.find((t) => t.id === item.id);
    if (exists) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== item.id));
    } else {
      if (selectedToppings.length >= 8) return; // hard cap
      setSelectedToppings([...selectedToppings, item]);
    }
  };

  const canNext = () => {
    if (step === 1) return noodle !== null;
    if (step === 2) return selectedToppings.length > 0;
    if (step === 3) return soup !== null;
    return true;
  };

  const handleConfirm = () => {
    const item = {
      id: "custom_" + Date.now(),
      name: `自选锅（${noodle.name}）`,
      nameEn: `Build Your Bowl (${noodle.nameEn || noodle.name})`,
      desc: `${soup.name}汤底 · ${selectedToppings.map((t) => t.name).join("、")}`,
      descEn: `${soup.nameEn || soup.name} broth · ${selectedToppings.map((t) => t.nameEn || t.name).join(", ")}`,
      price: calcTotal(),
      isCustom: true,
    };
    onAdd(item);
  };

  const steps = lang === "en" ? [t.builder_step1, t.builder_step2, t.builder_step3] : ["选主食", "选配料", "选汤底"];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #8b0000, #c9a84c)",
            padding: "16px 20px 12px",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              right: 16,
              top: 14,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              width: 30,
              height: 30,
              borderRadius: "50%",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>
{t.builder_title}
          </div>
<div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 2 }}>{t.builder_step_label(step, 3)}</div>
          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 10,
                  color: i + 1 <= step ? "#fff" : "rgba(255,255,255,0.4)",
                  fontWeight: i + 1 === step ? 800 : 400,
                }}
              >
                <div
                  style={{
                    height: 3,
                    borderRadius: 2,
                    background:
                      i + 1 < step
                        ? "#fff"
                        : i + 1 === step
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.2)",
                    marginBottom: 4,
                  }}
                />
                {s}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* Step 1 */}
          {step === 1 && (
            <div>
<div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#1a0a00" }}>{lang === "en" ? "Choose your noodles" : "选择主食"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {NOODLES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => setNoodle(n)}
                    style={{
                      border: noodle?.id === n.id ? "2px solid #e63946" : "2px solid #f0e6d3",
                      borderRadius: 14,
                      padding: "14px 12px",
                      background: noodle?.id === n.id ? "#fff5f5" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
<div style={{ fontWeight: 700, fontSize: 15, color: "#1a0a00" }}>{lang === "en" && n.nameEn ? n.nameEn : n.name}</div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{lang === "en" && n.descEn ? n.descEn : n.desc}</div>
                    {noodle?.id === n.id && (
                      <div style={{ color: "#e63946", fontSize: 12, marginTop: 4, fontWeight: 700 }}>{lang === "en" ? "✓ Selected" : "✓ 已选"}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
<div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: "#1a0a00" }}>{lang === "en" ? "Choose your toppings" : "选择配料"}</div>
              <div
                style={{
                  background: "#fff5eb",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginBottom: 14,
                  fontSize: 12,
                  color: "#c9a84c",
                  fontWeight: 600,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{lang === "en" ? `${selectedToppings.length} selected · some items are charged extra` : `已选 ${selectedToppings.length} 样 · 部分食材另加价`}</span>
                <span style={{ color: "#e63946" }}>RM {calcTotal().toFixed(2)}</span>
              </div>

              {Object.entries(TOPPINGS).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#999",
                      marginBottom: 8,
                      letterSpacing: 0.5,
                    }}
                  >
                    {lang === "en" ? ({蔬菜类:"Vegetables",肉类:"Meat","丸类 / 加工类":"Balls & Processed",豆制品:"Tofu"}[cat] || cat) : cat}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {items.map((item) => {
                      const sel = selectedToppings.find((t) => t.id === item.id);
                      const atCap = selectedToppings.length >= 8 && !sel;
                      return (
                        <button
                          key={item.id}
                          onClick={() => !atCap && toggleTopping(item)}
                          style={{
                            border: sel ? "2px solid #e63946" : "1.5px solid #e8e0d8",
                            borderRadius: 24,
                            padding: "6px 14px",
                            background: sel ? "#fff5f5" : atCap ? "#f9f9f9" : "#fff",
                            cursor: atCap ? "not-allowed" : "pointer",
                            fontSize: 13,
                            color: sel ? "#e63946" : atCap ? "#ccc" : "#333",
                            fontWeight: sel ? 700 : 400,
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
{lang === "en" && item.nameEn ? item.nameEn : item.name}
                          {item.price > 0 && (
                            <span style={{ fontSize: 10, color: sel ? "#e63946" : "#aaa" }}>
                              +{item.price.toFixed(2)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
<div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14, color: "#1a0a00" }}>{lang === "en" ? "Choose your broth" : "选择汤底"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SOUPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSoup(s)}
                    style={{
                      border: soup?.id === s.id ? "2px solid #e63946" : "2px solid #f0e6d3",
                      borderRadius: 16,
                      padding: "16px 18px",
                      background: soup?.id === s.id ? "#fff5f5" : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 32 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a0a00" }}>
{lang === "en" && s.nameEn ? s.nameEn : s.name}
                      </div>
                      <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{lang === "en" && s.descEn ? s.descEn : s.desc}</div>
                    </div>
                    {soup?.id === s.id && (
                      <span style={{ marginLeft: "auto", color: "#e63946", fontSize: 18 }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
        </div>

        {/* Summary — only on step 3 when all selections made */}
        {step === 3 && noodle && soup && (
          <div style={{ padding: "0 20px 12px" }}>
            <div style={{
              background: "linear-gradient(135deg, #1a0a00, #2d1200)",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(201,168,76,0.2)",
            }}>
              <div style={{ fontSize: 10, color: "rgba(201,168,76,0.7)", fontWeight: 700, letterSpacing: 1.5, marginBottom: 8 }}>
                {lang === "en" ? "YOUR BOWL" : "你的碗"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>🍜</span>
                  <span style={{ fontSize: 13, color: "#f5d88a", fontWeight: 700 }}>
                    {lang === "en" && noodle.nameEn ? noodle.nameEn : noodle.name}
                  </span>
                </div>
                {selectedToppings.length > 0 && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🥢</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                      {selectedToppings.map((t) => lang === "en" && t.nameEn ? t.nameEn : t.name).join(" · ")}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{soup.emoji}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                    {lang === "en" && soup.nameEn ? soup.nameEn : soup.name}
                    {lang === "en" ? " broth" : "汤底"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #f0e6d3", display: "flex", gap: 10 }}>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 14,
                border: "1.5px solid #e0d4c4",
                background: "#fff",
                fontSize: 15,
                fontWeight: 700,
                color: "#666",
                cursor: "pointer",
              }}
            >
              {t.xlg_back}
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleConfirm())}
            disabled={!canNext()}
            style={{
              flex: 2,
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: canNext()
                ? "linear-gradient(135deg, #8b0000, #e63946)"
                : "#e0d4c4",
              color: canNext() ? "#fff" : "#aaa",
              fontSize: 15,
              fontWeight: 800,
              cursor: canNext() ? "pointer" : "not-allowed",
              letterSpacing: 0.5,
            }}
          >
{step < 3 ? t.builder_next(calcTotal().toFixed(2)) : t.builder_add(calcTotal().toFixed(2))}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, subtle }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 6,
        fontSize: subtle ? 12 : 13,
        color: subtle ? "#aaa" : "#555",
      }}
    >
      <span>{label}</span>
      <span style={{ maxWidth: "55%", textAlign: "right", fontWeight: subtle ? 400 : 600 }}>
        {value}
      </span>
    </div>
  );
}

// ─── CART DRAWER ─────────────────────────────────────────────────────────────

function CartDrawer({ cart, onClose, onRemove, onCheckout, onUpdateCart, onAddItem, lang = "zh" }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [addonTarget, setAddonTarget] = useState(null); // cartId of item being customised
  const [selectedAddons, setSelectedAddons] = useState([]);

  const isBowl = (item) => !item.isCustom && !item.isXianguo && !item.id?.startsWith("sn");

  const openAddon = (item) => {
    setAddonTarget(item.cartId);
    setSelectedAddons(item.addons || []);
  };

  const closeAddon = () => {
    setAddonTarget(null);
    setSelectedAddons([]);
  };

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const confirmAddons = () => {
    const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
    const baseItem = cart.find((c) => c.cartId === addonTarget);
    if (!baseItem) return closeAddon();
    // Get base price without previous addons
    const basePrice = baseItem.basePrice || baseItem.price - (baseItem.addons || []).reduce((s, a) => s + a.price, 0);
    onUpdateCart(addonTarget, {
      ...baseItem,
      basePrice,
      price: basePrice + addonTotal,
      addons: selectedAddons,
    });
    closeAddon();
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 900, display: "flex", alignItems: "flex-end" }}
      onClick={addonTarget ? closeAddon : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxHeight: "78vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 -4px 24px rgba(0,0,0,0.1)" }}
      >
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0e6d3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 17, color: "#1a0a00" }}>
            {lang === "en" ? `Cart (${cart.reduce((s, i) => s + i.qty, 0)} item${cart.reduce((s,i)=>s+i.qty,0) !== 1 ? "s" : ""})` : `购物车（${cart.reduce((s, i) => s + i.qty, 0)} 件）`}
          </span>
          <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        {/* Item list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {cart.map((item) => (
            <div key={item.cartId}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: addonTarget === item.cartId ? "none" : "1px solid #f7f2ec", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0a00" }}>
                    {lang === "en" && item.nameEn ? item.nameEn : item.name}
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <div style={{ fontSize: 11, color: "#c9a84c", marginTop: 2 }}>
                      {lang === "en" ? "Add-ons: " : "加料："}{item.addons.map((a) => lang === "en" && a.nameEn ? a.nameEn : a.name).join(", ")}
                    </div>
                  )}
                  {item.desc && !item.addons?.length && (
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
                      {lang === "en" && item.descEn ? item.descEn : item.desc}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Gold 加料 button — only for bowls */}
                  {isBowl(item) && (
                    <button
                      onClick={() => openAddon(item)}
                      style={{
                        background: addonTarget === item.cartId ? "#c9a84c" : "rgba(201,168,76,0.12)",
                        border: "1.5px solid #c9a84c",
                        borderRadius: 20, padding: "4px 10px",
                        fontSize: 11, fontWeight: 700,
                        color: addonTarget === item.cartId ? "#fff" : "#c9a84c",
                        cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >
                      {lang === "en" ? "+ Extras" : "+ 加料"}
                    </button>
                  )}
                  <div style={{ fontWeight: 800, color: "#e63946", fontSize: 14, minWidth: 56, textAlign: "right" }}>
                    RM {(item.price * item.qty).toFixed(2)}
                  </div>
                  <button onClick={() => onRemove(item.cartId)} style={{ background: "#f5f5f5", border: "none", width: 26, height: 26, borderRadius: "50%", fontSize: 14, cursor: "pointer", color: "#999" }}>×</button>
                </div>
              </div>

              {/* Inline addon selector — expands under the item */}
              {addonTarget === item.cartId && (
                <div style={{ background: "#faf8f5", borderRadius: 14, padding: 14, marginBottom: 8, border: "1px solid #f0e6d3" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#999", marginBottom: 10 }}>
                    {lang === "en" ? "Choose add-ons" : "选择加料"}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {ADDONS.map((addon) => {
                      const sel = selectedAddons.find((a) => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          style={{
                            border: sel ? "2px solid #e63946" : "1.5px solid #f0e6d3",
                            borderRadius: 10, padding: "10px 8px",
                            background: sel ? "#fff5f5" : "#fff",
                            cursor: "pointer", textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 22, marginBottom: 3 }}>{addon.emoji}</div>
                          <div style={{ fontWeight: 700, fontSize: 12, color: "#1a0a00" }}>{lang === "en" && addon.nameEn ? addon.nameEn : addon.name}</div>
                          <div style={{ fontSize: 11, color: "#e63946", fontWeight: 700 }}>+RM {addon.price.toFixed(2)}</div>
                          {sel && <div style={{ fontSize: 10, color: "#e63946", fontWeight: 700 }}>✓</div>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={closeAddon} style={{ flex: 1, padding: "10px 0", border: "1.5px solid #e0d4c4", borderRadius: 10, background: "#fff", fontSize: 13, color: "#666", fontWeight: 600, cursor: "pointer" }}>
                      {lang === "en" ? "Cancel" : "取消"}
                    </button>
                    <button onClick={confirmAddons} style={{ flex: 2, padding: "10px 0", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                      {lang === "en"
                        ? `Confirm${selectedAddons.length > 0 ? ` · +RM ${selectedAddons.reduce((s,a)=>s+a.price,0).toFixed(2)}` : ""}`
                        : `确认${selectedAddons.length > 0 ? ` · +RM ${selectedAddons.reduce((s,a)=>s+a.price,0).toFixed(2)}` : ""}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Secondary snack upsell — compact, inside cart */}
        {(() => {
          const snackIds = ["sn1","sn2","sn3","sn4","sn5"];
          const hasSnack = cart.some((i) => snackIds.includes(i.id));
          const hasBowl = cart.some((i) => !snackIds.includes(i.id));
          if (!hasBowl || hasSnack) return null;
          return (
            <div style={{ padding: "0 20px 10px" }}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 700, marginBottom: 8, letterSpacing: 0.5 }}>
                {lang === "en" ? "YOU MIGHT ALSO LIKE" : "很多人都会加"}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {SNACKS.slice(0, 2).map((snack) => (
                  <button
                    key={snack.id}
                    onClick={() => onAddItem && onAddItem({ ...snack, addons: [], cartId: "cart_" + Date.now() + "_" + Math.random().toString(36).slice(2) })}
                    style={{ flex: 1, background: "#faf8f5", border: "1.5px solid #f0e6d3", borderRadius: 12, padding: "10px 8px", cursor: "pointer", textAlign: "center" }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{snack.img}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a0a00", marginBottom: 2 }}>
                      {lang === "en" && snack.nameEn ? snack.nameEn : snack.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#e63946", fontWeight: 800, marginBottom: 6 }}>RM {snack.price.toFixed(2)}</div>
                    <div style={{ background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", borderRadius: 8, padding: "4px 0", fontSize: 11, fontWeight: 800 }}>
                      + {lang === "en" ? "Add" : "加入"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Cart Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #f0e6d3", display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "#999" }}>{T[lang].pay_total_label}</div>
            <div style={{ fontWeight: 900, fontSize: 22, color: "#e63946" }}>RM {total.toFixed(2)}</div>
          </div>
          <button
            onClick={onCheckout}
            style={{
              flex: 1,
              padding: "14px 0",
              background: "linear-gradient(135deg, #8b0000, #e63946)",
              color: "#fff",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {lang === "en" ? "Checkout" : "结算"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────

function CheckoutPage({ cart, lang, onUpdateQty, onRemove, onProceedToPayment, onContinueShopping }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [savedDetails, setSavedDetails] = useState(false);
  const dateOptions = getDateOptions();
  const [date, setDate] = useState(dateOptions[0].value);
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({});

  // Load saved name/phone on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("syj_contact") || "{}");
      if (saved.name) { setName(saved.name); setSavedDetails(true); }
      if (saved.phone) setPhone(saved.phone);
    } catch {}
  }, []);

  const clearSaved = () => {
    try { localStorage.removeItem("syj_contact"); } catch {}
    setName("");
    setPhone("");
    setSavedDetails(false);
  };

  const slots = getAllTimeSlots();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [showAllSlots, setShowAllSlots] = useState(false);

  // Available (non-disabled) slots for the current date
  const availableSlots = slots.filter((s) => !isSlotDisabled(s.value, date));

  // Auto-select earliest available slot when date changes (or on first render if nothing selected)
  useEffect(() => {
    if (availableSlots.length > 0) {
      const currentValid = time && availableSlots.find((s) => s.value === time);
      if (!currentValid) {
        setTime(availableSlots[0].value);
      }
    }
  }, [date]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTime(""); // will be auto-set by useEffect
    setShowAllSlots(false);
  };

  const [cartExpanded, setCartExpanded] = useState(false);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const validate = () => {
    const err = {};
    if (!name.trim()) err.name = T[lang].err_name;
    if (!phone.trim() || phone.length < 8) err.phone = T[lang].err_phone;
    if (!time) err.time = T[lang].err_time;
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    try { localStorage.setItem("syj_contact", JSON.stringify({ name, phone })); } catch {}
    onProceedToPayment({ name, phone, date, time, orderId: generateOrderId() });
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#faf8f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🍜</div>
        <div style={{ fontWeight: 900, fontSize: 20, color: "#1a0a00", marginBottom: 8 }}>
          {lang === "en" ? "Your cart is empty" : "购物车还是空的"}
        </div>
        <div style={{ fontSize: 14, color: "#888", marginBottom: 32, lineHeight: 1.6 }}>
          {lang === "en" ? "Not sure what to get? Start with our most popular bowl." : "不知道点什么？先试试最多人点的这碗。"}
        </div>

        {/* Signature recommendation card */}
        <div
          onClick={() => onContinueShopping("经典款")}
          style={{
            background: "linear-gradient(135deg, #1a0a00, #3d1200)",
            border: "1px solid #c9a84c",
            borderRadius: 20,
            padding: "20px 24px",
            width: "100%",
            maxWidth: 320,
            cursor: "pointer",
            marginBottom: 16,
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 44 }}>🍜</div>
            <div>
              <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
                {lang === "en" ? "MOST ORDERED" : "最多人点"}
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#f5d88a" }}>
                {lang === "en" ? "Chicken Mala Tang" : "鸡肉麻辣烫"}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                RM 18.90
              </div>
            </div>
          </div>
          <div style={{ marginTop: 14, background: "linear-gradient(135deg, #8b0000, #e63946)", borderRadius: 10, padding: "10px 0", textAlign: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
            {lang === "en" ? "Order this →" : "就点这个 →"}
          </div>
        </div>

        <button
          onClick={() => onContinueShopping("经典款")}
          style={{ background: "none", border: "none", fontSize: 13, color: "#aaa", cursor: "pointer", padding: 8 }}
        >
          {lang === "en" ? "Browse full menu →" : "查看完整菜单 →"}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #8b0000, #c9a84c)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onContinueShopping}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          {T[lang].checkout_back}
        </button>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{T[lang].checkout_title}</span>
      </div>

      <div style={{ padding: 20 }}>
        {/* Collapsible cart summary */}
        <div style={{ background: "#fff", borderRadius: 16, marginBottom: 14, border: "1px solid #f0e6d3", overflow: "hidden" }}>
          {/* Toggle row — always visible */}
          <button
            onClick={() => setCartExpanded((v) => !v)}
            style={{
              width: "100%", padding: "14px 16px",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ width: 3, height: 14, background: "#e63946", borderRadius: 2, flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontWeight: 800, fontSize: 14, color: "#1a0a00", flexShrink: 0 }}>
                {T[lang].order_title}
              </span>
              <span style={{ fontSize: 12, color: "#aaa", fontWeight: 400 }}>{T[lang].cart_count(itemCount)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 900, fontSize: 15, color: "#e63946" }}>RM {total.toFixed(2)}</span>
              <span style={{ fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 2 }}>
{cartExpanded ? T[lang].collapse : T[lang].expand}
                <span style={{ fontSize: 10, display: "inline-block", transform: cartExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
              </span>
            </div>
          </button>

          {/* Expanded: full item list + qty controls */}
          {cartExpanded && (
            <div style={{ padding: "0 16px 14px" }}>
              <div style={{ height: 1, background: "#f7f2ec", marginBottom: 4 }} />
              {cart.map((item) => (
                <div key={item.cartId} style={{ padding: "10px 0", borderBottom: "1px solid #f7f2ec" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0a00" }}>{lang === "en" && item.nameEn ? item.nameEn : item.name}</div>
                      {item.addons && item.addons.length > 0 && (
                        <div style={{ fontSize: 11, color: "#c9a84c", marginTop: 2 }}>
                          {T[lang].addons_label}{item.addons.map((a) => lang === "en" && a.nameEn ? a.nameEn : a.name).join(", ")}
                        </div>
                      )}
                      {item.isCustom && item.desc && (
                        <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{item.desc}</div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#e63946", marginTop: 4 }}>
                        RM {(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <button onClick={() => onRemove(item.cartId)}
                        style={{ background: "none", border: "none", color: "#ccc", fontSize: 16, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>
                        ×
                      </button>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => onUpdateQty(item.cartId, item.qty - 1)}
                          style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #e0d4c4", background: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#666", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          −
                        </button>
                        <span style={{ fontWeight: 800, fontSize: 14, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => onUpdateQty(item.cartId, item.qty + 1)}
                          style={{ width: 28, height: 28, borderRadius: "50%", background: "#e63946", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pickup Location */}
        <Section title={T[lang].location_title}>
          <div style={{ background: "#faf8f5", border: "1px solid #f0e6d3", borderRadius: 14, padding: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#1a0a00", marginBottom: 6 }}>{lang === "en" ? "Shuangyu" : BRAND.name}</div>
            <AddressCopy address={BRAND.address} addressCN={BRAND.addressCN} lang={lang} />
<div style={{ fontSize: 12, color: "#999", marginTop: 6 }}>{T[lang].hours_label}{lang === "en" ? BRAND.hoursEn : BRAND.hours}</div>
<div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 600, marginTop: 6 }}>{T[lang].pickup_note}</div>
            <a href={BRAND.mapUrl} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 12, background: "#fff8f0", border: "1.5px solid #f0e6d3", borderRadius: 24, padding: "7px 14px", color: "#8b0000", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              {T[lang].show_map}
            </a>
          </div>
        </Section>

        {/* Customer Info */}
        <Section title={T[lang].contact_title}>
          {savedDetails && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
              <button onClick={clearSaved} style={{ background: "none", border: "none", fontSize: 11, color: "#bbb", cursor: "pointer", padding: 0 }}>
                {lang === "en" ? "Not you? Clear" : "不是你？清除"}
              </button>
            </div>
          )}
          <Input label={T[lang].name_label} placeholder={T[lang].name_ph} value={name} onChange={(v) => { setName(v); setSavedDetails(false); }} error={errors.name} />
          <Input label={T[lang].phone_label} placeholder={T[lang].phone_ph} value={phone} onChange={setPhone} error={errors.phone} type="tel" />
        </Section>

        {/* Pickup Time */}
        <Section title={T[lang].time_title}>

          {/* Selected time — prominent confirmation block, shown when time is chosen */}
          {time && (
            <div style={{
              background: "linear-gradient(135deg, #1a0a00, #3d1200)",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}>
              <div style={{ fontSize: 28 }}>🕐</div>
              <div>
                <div style={{ fontSize: 10, color: "rgba(201,168,76,0.7)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>
                  {lang === "en" ? "Pickup Confirmed" : "取餐时间"}
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f5d88a", letterSpacing: -0.5 }}>
                  {(() => {
                    const opt = dateOptions.find((d) => d.value === date);
                    const dateLabel = opt ? (lang === "en" && opt.labelEN ? opt.labelEN : opt.label) : "";
                    return `${dateLabel} ${formatTime12h(time)}`;
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Date buttons */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: "#999", fontWeight: 600, display: "block", marginBottom: 6 }}>{T[lang].date_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {dateOptions.map((d) => (
                <button key={d.value} onClick={() => handleDateChange(d.value)}
                  style={{ flex: 1, padding: "10px 8px", border: date === d.value ? "2px solid #e63946" : "1.5px solid #e0d4c4", borderRadius: 10, background: date === d.value ? "#fff5f5" : "#fff", color: date === d.value ? "#e63946" : "#333", fontWeight: date === d.value ? 700 : 400, fontSize: 13, cursor: "pointer" }}>
                  {lang === "en" && d.labelEN ? d.labelEN : d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time grid */}
          <div>
            <label style={{ fontSize: 12, color: "#999", fontWeight: 600, display: "block", marginBottom: 6 }}>{T[lang].time_label}</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {(showAllSlots ? availableSlots : availableSlots.slice(0, 5)).map((slot) => (
                <button key={slot.value} onClick={() => setTime(slot.value)}
                  style={{ padding: "9px 4px", border: time === slot.value ? "2px solid #e63946" : "1px solid #e0d4c4", borderRadius: 8, background: time === slot.value ? "#fff5f5" : "#fff", color: time === slot.value ? "#e63946" : "#333", fontSize: 11, cursor: "pointer", fontWeight: time === slot.value ? 700 : 400 }}>
                  {formatTime12h(slot.value)}
                </button>
              ))}
              {!showAllSlots && availableSlots.length > 5 && (
                <button onClick={() => setShowAllSlots(true)}
                  style={{ padding: "9px 4px", border: "1px dashed #e0d4c4", borderRadius: 8, background: "#faf8f5", color: "#999", fontSize: 11, cursor: "pointer" }}>
                  {T[lang].more_slots}
                </button>
              )}
            </div>
            {showAllSlots && (
              <button onClick={() => setShowAllSlots(false)}
                style={{ marginTop: 8, width: "100%", padding: "7px 0", border: "1px dashed #e0d4c4", borderRadius: 8, background: "#faf8f5", color: "#999", fontSize: 11, cursor: "pointer" }}>
                {T[lang].fewer_slots}
              </button>
            )}
            {errors.time && <div style={{ color: "#e63946", fontSize: 12, marginTop: 6 }}>{errors.time}</div>}
          </div>
        </Section>

        {/* Payment info */}
        <Section title={T[lang].payment_title}>
          <div style={{ background: "#faf8f5", border: "1px solid #f0e6d3", borderRadius: 14, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 36 }}>🔒</div>
            <div>
<div style={{ fontWeight: 800, fontSize: 14, color: "#1a0a00", marginBottom: 4 }}>{T[lang].payment_method}</div>
<div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{T[lang].payment_sub}</div>
            </div>
          </div>
        </Section>

      </div>

      {/* Bottom Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "#fff", borderTop: "1px solid #f0e6d3", display: "flex", alignItems: "center", gap: 14 }}>
        <div>
<div style={{ fontSize: 11, color: "#999" }}>{T[lang].amount_label}</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#e63946" }}>RM {total.toFixed(2)}</div>
        </div>
        <button onClick={handleSubmit}
          style={{ flex: 1, padding: 15, background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
          {T[lang].pay_btn}
        </button>
      </div>
    </div>
  );
}

function AddressCopy({ address, addressCN, lang }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(address); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", width: "100%" }}
    >
      <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
        {addressCN && lang !== "en" && <>{addressCN}<br /></>}{address}
      </div>
      <div style={{ fontSize: 11, color: copied ? "#e63946" : "#c9a84c", fontWeight: 600, marginTop: 3, transition: "color 0.2s" }}>
        {copied ? (lang === "en" ? "Copied ✓" : "已复制 ✓") : (lang === "en" ? "Tap to copy address" : "点击复制地址")}
      </div>
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        border: "1px solid #f0e6d3",
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 14,
          color: "#1a0a00",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 3,
            height: 14,
            background: "#e63946",
            borderRadius: 2,
            display: "inline-block",
          }}
        />
        {title}
      </div>
      {children}
    </div>
  );
}

function Input({ label, placeholder, value, onChange, error, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          fontSize: 12,
          color: "#999",
          fontWeight: 600,
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "11px 14px",
          border: `1.5px solid ${error ? "#e63946" : "#e0d4c4"}`,
          borderRadius: 10,
          fontSize: 14,
          outline: "none",
          background: "#faf8f5",
          boxSizing: "border-box",
          color: "#1a0a00",
        }}
      />
      {error && <div style={{ color: "#e63946", fontSize: 11, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ─── ORDER CONFIRMATION ───────────────────────────────────────────────────────

function ConfirmationPage({ order, cart, onDone, lang = "zh", orderCount = 1 }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [copied, setCopied] = useState(false);

  const dateLabel = order.date === new Date().toISOString().split("T")[0] ? (lang === "en" ? "Today" : "今天") : order.date;

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic header based on order count
  const getHeader = () => {
    if (lang === "en") {
      if (orderCount === 1) return { line1: "You're all set 🍜", line2: null };
      if (orderCount === 2) return { line1: "Back for more 🔥", line2: "You know what's good" };
      if (orderCount === 3) return { line1: "Third time! 🔥", line2: "You're a regular now" };
      if (orderCount >= 5) return { line1: "Shuangyu Regular 👑", line2: "We see you. Thanks for coming back." };
      return { line1: "Back again 🍜", line2: "Good to have you back" };
    } else {
      if (orderCount === 1) return { line1: "搞定，等开吃 🍜", line2: null };
      if (orderCount === 2) return { line1: "又来了 🔥", line2: "识货的人" };
      if (orderCount === 3) return { line1: "第三次了！🔥", line2: "老朋友了" };
      if (orderCount >= 5) return { line1: "双瑜记常客 👑", line2: "谢谢你一直支持" };
      return { line1: "又来啦 🍜", line2: "欢迎回来" };
    }
  };

  const header = getHeader();

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", paddingBottom: 100, fontFamily: FONT.ui }}>

      {/* ══ HERO ZONE — full-bleed gradient ══ */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          background: "linear-gradient(155deg, #1a0400 0%, #5c1200 35%, #8b0000 65%, #b5341c 85%, #c9a84c 100%)",
          padding: "56px 24px 80px",
          position: "relative",
          textAlign: "center",
        }}>
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: 0, left: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,57,43,0.15) 0%, transparent 65%)", pointerEvents: "none" }} />
          {/* Diagonal texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 12px)", pointerEvents: "none" }} />

          {/* Paw icon ring */}
          <div style={{ position: "relative", zIndex: 1, marginBottom: 18 }}>
            <div style={{
              width: 64, height: 64,
              borderRadius: "50%",
              border: "1.5px solid rgba(245,216,138,0.3)",
              background: "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 0 0 8px rgba(245,216,138,0.04)",
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="rgba(245,216,138,0.9)">
                <ellipse cx="6" cy="5.5" rx="2.2" ry="2.8"/>
                <ellipse cx="12" cy="4" rx="2.2" ry="2.8"/>
                <ellipse cx="18" cy="5.5" rx="2.2" ry="2.8"/>
                <path d="M4.5 13.5c0-3.5 3-5.5 7.5-5.5s7.5 2 7.5 5.5c0 2.8-2 4.5-7.5 4.5s-7.5-1.7-7.5-4.5z"/>
                <ellipse cx="9" cy="15" rx="1.1" ry="1.4"/>
                <ellipse cx="12" cy="16" rx="1.1" ry="1.4"/>
                <ellipse cx="15" cy="15" rx="1.1" ry="1.4"/>
              </svg>
            </div>
          </div>

          {/* Status label */}
          <div style={{ position: "relative", zIndex: 1, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(201,168,76,0.65)", marginBottom: 10 }}>
            {header.line2 || (lang === "en" ? "Order Confirmed" : "订单已确认")}
          </div>

          {/* Main headline */}
          <div style={{ position: "relative", zIndex: 1, fontFamily: FONT.brand, fontSize: 28, fontWeight: 900, color: "#f5d88a", letterSpacing: 1, lineHeight: 1.2, marginBottom: 6, textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
            {header.line1}
          </div>

          {/* Brand sub */}
          <div style={{ position: "relative", zIndex: 1, fontSize: 11, color: "rgba(201,168,76,0.5)", letterSpacing: 4, fontWeight: 600, marginBottom: 0 }}>
            {lang === "en" ? "SHUANG YU JI" : "双 瑜 记"}
          </div>
        </div>

        {/* White pull-up */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 36, background: "#faf8f5", borderRadius: "20px 20px 0 0" }} />
      </div>

      {/* ══ PICKUP CARD — floats over the gradient ══ */}
      <div style={{ padding: "0 20px", marginTop: -16, position: "relative", zIndex: 2 }}>
        <div style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #f0e6d3",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(26,10,0,0.1)",
        }}>
          {/* Pickup time row — prominent */}
          <div style={{
            background: "linear-gradient(135deg, #fdf3d8 0%, #fff8ec 100%)",
            borderBottom: "1px solid #f0e6d3",
            padding: "20px 20px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#c9a84c", marginBottom: 6 }}>
                {lang === "en" ? "Pickup Time" : "取餐时间"}
              </div>
              <div style={{ fontFamily: FONT.brand, fontSize: 32, fontWeight: 900, color: "#1a0a00", lineHeight: 1, letterSpacing: -0.5 }}>
                {formatTime12h(order.time)}
              </div>
              <div style={{ fontSize: 11, color: "#8b6a5a", marginTop: 5 }}>
                {dateLabel === new Date().toISOString().split("T")[0] ? (lang === "en" ? "Today" : "今天") : dateLabel}
                {" · "}{lang === "en" ? "Please arrive on time" : "请准时到店"}
              </div>
            </div>
            {/* Clock icon */}
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#c9a84c" strokeWidth="1.5"/>
                <path d="M12 7v5l3 3" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Order number row */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f7f2ec", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#aaa", marginBottom: 4 }}>
                {lang === "en" ? "Order No." : "订单号"}
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#c0392b", letterSpacing: 1, fontFamily: FONT.ui }}>
                {order.orderId}
              </div>
            </div>
            <button
              onClick={copyOrderId}
              style={{
                background: copied ? "rgba(201,168,76,0.15)" : "#faf8f5",
                border: `1.5px solid ${copied ? "#c9a84c" : "#f0e6d3"}`,
                borderRadius: 10, padding: "8px 16px",
                cursor: "pointer", fontSize: 11, fontWeight: 700,
                color: copied ? "#8b6a00" : "#8b6a5a",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              {copied ? "✓ " : ""}
              {copied ? (lang === "en" ? "Copied" : "已复制") : (lang === "en" ? "Copy" : "复制订单号")}
            </button>
          </div>

          {/* Location row */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #f7f2ec" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#aaa", marginBottom: 6 }}>
              {lang === "en" ? "Pickup Location" : "取餐地点"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a0a00", marginBottom: 2 }}>双瑜记 · Taman Salak South</div>
            <div style={{ fontSize: 11, color: "#8b6a5a", lineHeight: 1.5, marginBottom: 10 }}>
              A83A, Jalan Tuanku 2, Taman Salak South, 57100 KL
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={BRAND.mapUrl} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "#faf8f5", border: "1.5px solid #f0e6d3",
                borderRadius: 20, padding: "7px 14px",
                fontSize: 12, fontWeight: 700, color: "#8b0000", textDecoration: "none",
              }}>
                📍 {lang === "en" ? "Open Maps" : "导航"}
              </a>
              <div style={{ display: "inline-flex", alignItems: "center", fontSize: 11, color: "#aaa", padding: "7px 4px" }}>
                {lang === "en" ? "Show order no. at counter" : "到店报订单号"}
              </div>
            </div>
          </div>

          {/* Rider note */}
          <div style={{ padding: "12px 20px", background: "#faf8f5", display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f0e6d3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <ellipse cx="6" cy="5.5" rx="2.2" ry="2.8" fill="#8b6a5a"/>
                <ellipse cx="12" cy="4" rx="2.2" ry="2.8" fill="#8b6a5a"/>
                <ellipse cx="18" cy="5.5" rx="2.2" ry="2.8" fill="#8b6a5a"/>
                <path d="M4.5 13.5c0-3.5 3-5.5 7.5-5.5s7.5 2 7.5 5.5c0 2.8-2 4.5-7.5 4.5s-7.5-1.7-7.5-4.5z" fill="#8b6a5a"/>
              </svg>
            </div>
            <div style={{ fontSize: 11, color: "#8b6a5a", lineHeight: 1.6 }}>
              {lang === "en" ? "Can't make it? Arrange a Lalamove or Grab pickup." : "无法到店？可自行安排 Lalamove / Grab 代取。"}
            </div>
          </div>
        </div>
      </div>

      {/* ══ ORDER SUMMARY ══ */}
      <div style={{ padding: "16px 20px 0" }}>
        <div style={{ background: "#fff", border: "1px solid #f0e6d3", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f7f2ec", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: 1.5, textTransform: "uppercase" }}>
              {lang === "en" ? "Your Order" : "你的订单"}
            </div>
            <div style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}>
              {cart.reduce((s,i)=>s+i.qty,0)} {lang === "en" ? "items" : "件"}
            </div>
          </div>
          <div style={{ padding: "4px 0" }}>
            {cart.map((item) => (
              <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 18px", borderBottom: "1px solid #faf8f5" }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1a0a00" }}>
                    {lang === "en" && item.nameEn ? item.nameEn : item.name}
                  </span>
                  <span style={{ fontSize: 11, color: "#ccc", marginLeft: 6 }}>×{item.qty}</span>
                  {item.addons && item.addons.length > 0 && (
                    <div style={{ fontSize: 10, color: "#c9a84c", marginTop: 1 }}>
                      {item.addons.map(a => lang === "en" && a.nameEn ? a.nameEn : a.name).join(", ")}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>RM {(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "14px 18px", background: "#faf8f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a0a00" }}>{lang === "en" ? "Total" : "合计"}</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#c0392b" }}>RM {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ══ CTAs ══ */}
      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Share */}
        <button
          onClick={() => {
            const dateStr = order.date === new Date().toISOString().split("T")[0] ? (lang === "en" ? "Today" : "今天") : order.date;
            const itemLines = cart.map((i) => `${lang === "en" && i.nameEn ? i.nameEn : i.name} x${i.qty} — RM ${(i.price * i.qty).toFixed(2)}`).join("\n");
            const msg = lang === "en"
              ? `Just ordered from Shuangyu 🍜\n\nPickup: ${dateStr} ${formatTime12h(order.time)}\n\n${itemLines}\n\nTotal: RM ${total.toFixed(2)}\n\nOrder online 👉 ${window.location.href}`
              : `我刚在双瑜记下单了 🍜\n\n取餐时间：${dateStr} ${formatTime12h(order.time)}\n\n${itemLines}\n\n合计：RM ${total.toFixed(2)}\n\n扫码点餐 👉 ${window.location.href}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
          }}
          style={{ width: "100%", padding: 14, background: "linear-gradient(135deg, #c9a84c, #f5d88a)", color: "#1a0a00", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <span style={{ fontSize: 17 }}>💬</span>
          {lang === "en" ? "Share with Friends" : "分享给好友"}
        </button>

        {/* Order again */}
        <button
          onClick={onDone}
          style={{ width: "100%", padding: 15, background: "linear-gradient(135deg, #8b0000, #c0392b)", color: "#f5d88a", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5 }}
        >
          {lang === "en" ? "Order Again 🍜" : "再来一单 🍜"}
        </button>

        {/* Back */}
        <button
          onClick={onDone}
          style={{ width: "100%", padding: 12, background: "none", color: "#bbb", border: "none", borderRadius: 14, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
        >
          {lang === "en" ? "Back to Menu" : "返回首页"}
        </button>
      </div>

    </div>
  );
}

// ─── PAYMENT PAGE ─────────────────────────────────────────────────────────────

function PaymentPage({ order, cart, onSuccess, onBack, lang = "zh" }) {
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [orderExpanded, setOrderExpanded] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handlePay = async () => {
    setStatus("processing");
    try {
      const res = await fetch("/api/create-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId:       order.orderId,
          customerName:  order.name,
          customerPhone: order.phone,
          pickupDate:    order.date,
          pickupTime:    order.time,
          items:         cart.map((i) => ({
            name:    i.name,
            nameEn:  i.nameEn || i.name,
            qty:     i.qty,
            price:   i.price,
          })),
          total,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("create-bill error:", err);
        setStatus("idle");
        alert(lang === "en"
          ? "Payment setup failed. Please try again."
          : "支付出错了，请再试一次。");
        return;
      }

      const { paymentUrl } = await res.json();
      window.location.href = paymentUrl; // Redirect to Toyyibpay
    } catch (err) {
      setStatus("idle");
      console.error("Payment error:", err);
      alert(lang === "en"
        ? "Network error. Please check your connection and try again."
        : "网络错误，请检查网络后重试。");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", paddingBottom: 100 }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #8b0000, #c9a84c)",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {status === "idle" && (
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              color: "#fff", width: 34, height: 34, borderRadius: "50%",
              fontSize: 18, cursor: "pointer",
            }}
          >←</button>
        )}
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>{T[lang].pay_header}</span>
      </div>

      <div style={{ padding: 20 }}>

        {/* ── Amount card ── */}
        <div
          style={{
            background: "#faf8f5",
            borderRadius: 16,
            padding: 24,
            marginBottom: 14,
            border: status === "success" ? "none" : "1px solid #f0e6d3",
            textAlign: "center",
          }}
        >
          {status === "success" ? (
            <>
              <div style={{ fontSize: 44, marginBottom: 10, color: "#c9a84c" }}>✦</div>
<div style={{ fontWeight: 900, fontSize: 20, color: "#1a0a00", marginBottom: 4 }}>
                {T[lang].pay_success}
              </div>
              <div style={{ fontSize: 13, color: "#aaa" }}>{T[lang].pay_success_sub}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 6 }}>{T[lang].amount_label}</div>
              <div style={{ fontWeight: 900, fontSize: 36, color: "#e63946", marginBottom: 4 }}>
                RM {total.toFixed(2)}
              </div>
              <div style={{ fontSize: 12, color: "#bbb" }}>{T[lang].conf_order_no}：{order.orderId}</div>
            </>
          )}
        </div>

        {/* ── Order summary ── */}
        {status !== "success" && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              marginBottom: 14,
              border: "1px solid #f0e6d3",
              overflow: "hidden",
            }}
          >
            {cart.length === 1 ? (
              /* Single item — show directly, no toggle */
              <div style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 3, height: 13, background: "#e63946", borderRadius: 2, display: "inline-block" }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#1a0a00" }}>{T[lang].pay_order_title}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, color: "#555" }}>
                    {lang === "en" && cart[0].nameEn ? cart[0].nameEn : cart[0].name}
                    <span style={{ color: "#aaa", marginLeft: 4 }}>x{cart[0].qty}</span>
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1a0a00" }}>
                    RM {(cart[0].price * cart[0].qty).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              /* Multiple items — collapsed summary row, tap to expand */
              <>
                <button
                  onClick={() => setOrderExpanded((v) => !v)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#1a0a00", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 3, height: 13, background: "#e63946", borderRadius: 2, display: "inline-block" }} />
                    {T[lang].pay_order_title}
                    <span style={{ fontWeight: 400, color: "#aaa", fontSize: 12 }}>
                      · {cart.reduce((s, i) => s + i.qty, 0)}{lang === "en" ? ` item${cart.reduce((s,i)=>s+i.qty,0)!==1?"s":""}` : " 件"}
                    </span>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1a0a00" }}>RM {total.toFixed(2)}</span>
                    <span style={{ fontSize: 10, color: "#bbb", display: "inline-block", transform: orderExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </span>
                </button>

                {orderExpanded && (
                  <div style={{ padding: "0 16px 12px" }}>
                    <div style={{ height: 1, background: "#f7f2ec", marginBottom: 8 }} />
                    {cart.map((item) => (
                      <div
                        key={item.cartId}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          padding: "6px 0",
                          borderBottom: "1px solid #f7f2ec",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ color: "#555" }}>
                          {lang === "en" && item.nameEn ? item.nameEn : item.name}
                          <span style={{ color: "#aaa", marginLeft: 4 }}>x{item.qty}</span>
                        </span>
                        <span style={{ fontWeight: 600, color: "#333" }}>
                          RM {(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10 }}>
                      <span style={{ fontSize: 13, color: "#999" }}>{T[lang].pay_total_label}</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: "#e63946" }}>RM {total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Payment method ── */}
        {status === "idle" && (
          <div
            style={{
              background: "#faf8f5",
              border: "1px solid #f0e6d3",
              borderRadius: 14,
              padding: 16,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ fontSize: 30 }}>💳</div>
            <div>
<div style={{ fontWeight: 800, fontSize: 14, color: "#1a0a00", marginBottom: 3 }}>{T[lang].payment_method}</div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>
{T[lang].pay_pickup}{order.name} · {order.phone}<br />
{T[lang].pay_time}{order.dateLabel} {formatTime12h(order.time)}
              </div>
            </div>
          </div>
        )}

        {/* ── Processing state ── */}
        {status === "processing" && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div
              style={{
                width: 44, height: 44,
                border: "4px solid #f0e6d3",
                borderTop: "4px solid #e63946",
                borderRadius: "50%",
                margin: "0 auto 16px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0a00" }}>
{T[lang].pay_processing}
            </div>
          </div>
        )}

        {status === "idle" && (
          <div style={{ fontSize: 11, color: "#bbb", textAlign: "center" }}>
{T[lang].pay_hint}
          </div>
        )}
      </div>

      {/* ── Bottom pay button ── */}
      {status === "idle" && (
        <div
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            padding: "12px 20px 16px",
            background: "#fff",
            borderTop: "1px solid #f0e6d3",
          }}
        >
          <button
            onClick={handlePay}
            style={{
              width: "100%",
              padding: 16,
              background: "linear-gradient(135deg, #8b0000, #e63946)",
              color: "#fff", border: "none", borderRadius: 14,
              fontSize: 16, fontWeight: 800, cursor: "pointer",
            }}
          >
            {T[lang].pay_confirm}
          </button>
          <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 8 }}>
            {lang === "en" ? "Usually completes in 2 seconds" : "通常在2秒内完成"}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = "syj2026!";

function AdminPanel({ orders, onExit }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("密码错误，请重试");
      setPw("");
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "100%", maxWidth: 360, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #f0e6d3" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔐</div>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#1a0a00", marginBottom: 4 }}>后台管理</div>
            <div style={{ fontSize: 13, color: "#999" }}>请输入管理员密码</div>
          </div>
          <input
            type="password"
            placeholder="输入密码"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "12px 14px", fontSize: 15,
              border: `1.5px solid ${pwError ? "#e63946" : "#e0d4c4"}`,
              borderRadius: 12, outline: "none", marginBottom: 8,
              boxSizing: "border-box", fontFamily: "inherit",
              background: "#faf8f5", color: "#1a0a00",
            }}
          />
          {pwError && (
            <div style={{ color: "#e63946", fontSize: 12, marginBottom: 10, textAlign: "center" }}>
              {pwError}
            </div>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: 14,
              background: "linear-gradient(135deg, #8b0000, #e63946)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 4,
            }}
          >
            进入后台
          </button>
        </div>
      </div>
    );
  }

  const [localOrders, setLocalOrders] = useState(orders);
  const [filter, setFilter] = useState("全部");
  const [selected, setSelected] = useState(null);

  const statuses = ["全部", "待处理", "制作中", "已完成"];
  const statusColors = {
    待处理: { bg: "#fff3cd", color: "#664d03" },
    制作中: { bg: "#cce5ff", color: "#003366" },
    已完成: { bg: "#d4edda", color: "#155724" },
  };

  const filtered =
    filter === "全部" ? localOrders : localOrders.filter((o) => o.status === filter);

  const updateStatus = (id, status) => {
    setLocalOrders(localOrders.map((o) => (o.id === id ? { ...o, status } : o)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1a0a00, #3d1a00)",
          padding: "16px 20px",
          color: "#f5d88a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>双瑜记 · Admin</div>
          <div style={{ fontSize: 12, color: "#c9a84c", marginTop: 2 }}>
            今日订单：{localOrders.length} 单
          </div>
        </div>
        <button
          onClick={onExit}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "#f5d88a",
            padding: "6px 14px",
            borderRadius: 20,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          返回前台
        </button>
      </div>

      {/* Stats */}
      <div style={{ padding: "14px 20px", display: "flex", gap: 10 }}>
        {[
          { label: "待处理", count: localOrders.filter((o) => o.status === "待处理").length, color: "#e63946" },
          { label: "制作中", count: localOrders.filter((o) => o.status === "制作中").length, color: "#007bff" },
          { label: "已完成", count: localOrders.filter((o) => o.status === "已完成").length, color: "#2d6a4f" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
              border: "1px solid #eee",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div
        style={{
          padding: "0 20px 12px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "7px 16px",
              border: filter === s ? "2px solid #8b0000" : "1.5px solid #e0d4c4",
              borderRadius: 20,
              background: filter === s ? "#8b0000" : "#fff",
              color: filter === s ? "#fff" : "#666",
              fontSize: 12,
              fontWeight: filter === s ? 700 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#ccc" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14 }}>暂无订单</div>
          </div>
        ) : filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelected(order)}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              border: "1px solid #f0e6d3",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 15, color: "#1a0a00" }}>
                {order.name}
              </span>
              <span
                style={{
                  ...statusColors[order.status],
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {order.status}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#999",
              }}
            >
              <span>#{order.id} · {order.date} {formatTime12h(order.time)}</span>
              <span style={{ fontWeight: 700, color: "#e63946" }}>
                RM {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              padding: 24,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>
              {selected.name}
            </div>
            <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>
              #{selected.id} · {selected.phone}
            </div>

            <div style={{ fontSize: 13, marginBottom: 12 }}>
              {selected.items.map((item, i) => (
                <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid #f5f5f5", color: "#555" }}>
                  {typeof item === "string" ? item : `${item.name} x${item.qty}`}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 900,
                fontSize: 16,
                marginBottom: 18,
              }}
            >
              <span>合计</span>
              <span style={{ color: "#e63946" }}>RM {selected.total.toFixed(2)}</span>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 8, fontWeight: 600 }}>
                更新状态
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["待处理", "制作中", "已完成"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    style={{
                      flex: 1,
                      padding: "10px 4px",
                      border:
                        selected.status === s
                          ? "2px solid #8b0000"
                          : "1.5px solid #e0d4c4",
                      borderRadius: 10,
                      background: selected.status === s ? "#8b0000" : "#fff",
                      color: selected.status === s ? "#fff" : "#666",
                      fontSize: 12,
                      fontWeight: selected.status === s ? 700 : 400,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{
                width: "100%",
                padding: 14,
                background: "#f5f5f5",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "#666",
                cursor: "pointer",
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── XIANGUO BUILDER ─────────────────────────────────────────────────────────

function XianguoBuilder({ onAdd, lang }) {
  const t = T[lang];
  const [step, setStep] = useState(1);
  const [portion, setPortion] = useState(null);
  const [spice, setSpice] = useState(null);
  const [addons, setAddons] = useState([]);

  const toggleAddon = (a) => setAddons((prev) =>
    prev.find((x) => x.id === a.id) ? prev.filter((x) => x.id !== a.id) : [...prev, a]
  );

  const addonTotal = addons.reduce((s, a) => s + a.price, 0);
  const total = (portion?.price || 0) + addonTotal;

  const canNext = () => step === 1 ? !!portion : step === 2 ? !!spice : true;

  const handleAdd = () => {
    const addonStr = addons.length > 0 ? addons.map((a) => a.name).join("、") : null;
    const addonStrEn = addons.length > 0 ? addons.map((a) => a.nameEn || a.name).join(", ") : null;
    onAdd({
      id: "xlg_" + Date.now(),
      name: `麻辣香锅（${portion.name} · ${spice.name}）`,
      nameEn: `Mala Xiang Guo (${portion.nameEn} · ${spice.nameEn})`,
      desc: addonStr ? `加料：${addonStr}` : null,
      descEn: addonStrEn ? `Add-ons: ${addonStrEn}` : null,
      price: total,
      isXianguo: true,
      addons: addons,
    });
  };

  return (
    <div style={{ padding: "0 0 20px" }}>
      {/* Section header */}
      <div style={{ background: "linear-gradient(135deg, #3d1a00, #8b0000)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🍲</span>
        <div>
          <div style={{ color: "#f5d88a", fontWeight: 800, fontSize: 14 }}>{t.xlg_title}</div>
          <div style={{ color: "#c9a84c", fontSize: 11 }}>{t.xlg_sub}</div>
        </div>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[t.xlg_step1, t.xlg_step2, t.xlg_step3].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: i + 1 <= step ? "#e63946" : "#ccc", fontWeight: i + 1 === step ? 800 : 400 }}>
            <div style={{ height: 3, borderRadius: 2, background: i + 1 < step ? "#e63946" : i + 1 === step ? "#e63946" : "#f0e6d3", marginBottom: 4, opacity: i + 1 === step ? 1 : i + 1 < step ? 0.6 : 1 }} />
            {s}
          </div>
        ))}
      </div>

      {/* Step 1 — Portion */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {XIANGUO_PORTIONS.map((p) => (
            <button key={p.id} onClick={() => setPortion(p)} style={{ border: portion?.id === p.id ? "2px solid #e63946" : "1.5px solid #f0e6d3", borderRadius: 14, padding: "14px 16px", background: portion?.id === p.id ? "#fff5f5" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a0a00" }}>{lang === "zh" ? p.name : p.nameEn}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{lang === "en" && p.descEn ? p.descEn : p.desc}</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#e63946" }}>RM {p.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 — Spice */}
      {step === 2 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {XIANGUO_SPICE.map((s) => (
            <button key={s.id} onClick={() => setSpice(s)} style={{ border: spice?.id === s.id ? "2px solid #e63946" : "1.5px solid #f0e6d3", borderRadius: 14, padding: "16px 12px", background: spice?.id === s.id ? "#fff5f5" : "#fff", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a0a00" }}>{lang === "zh" ? s.name : s.nameEn}</div>
              {spice?.id === s.id && <div style={{ fontSize: 11, color: "#e63946", marginTop: 4, fontWeight: 700 }}>✓</div>}
            </button>
          ))}
        </div>
      )}

      {/* Step 3 — Add-ons */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>{lang === "zh" ? "可多选" : "Select any"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {XIANGUO_ADDONS.map((a) => {
              const sel = addons.find((x) => x.id === a.id);
              return (
                <button key={a.id} onClick={() => toggleAddon(a)} style={{ border: sel ? "2px solid #e63946" : "1.5px solid #f0e6d3", borderRadius: 12, padding: "12px 8px", background: sel ? "#fff5f5" : "#fff", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 4 }}>{a.emoji}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a0a00" }}>{lang === "zh" ? a.name : a.nameEn}</div>
                  <div style={{ fontSize: 12, color: "#e63946", fontWeight: 700, marginTop: 2 }}>+RM {a.price.toFixed(2)}</div>
                  {sel && <div style={{ fontSize: 10, color: "#e63946", marginTop: 2, fontWeight: 700 }}>✓</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer nav */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: 13, borderRadius: 14, border: "1.5px solid #e0d4c4", background: "#fff", fontSize: 14, fontWeight: 700, color: "#666", cursor: "pointer" }}>
            {t.xlg_back}
          </button>
        )}
        {step < 3 ? (
          <button onClick={() => setStep(step + 1)} disabled={!canNext()} style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: canNext() ? "linear-gradient(135deg, #8b0000, #e63946)" : "#e0d4c4", color: canNext() ? "#fff" : "#aaa", fontSize: 15, fontWeight: 800, cursor: canNext() ? "pointer" : "not-allowed" }}>
            {t.xlg_next}
          </button>
        ) : (
          <button onClick={handleAdd} style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
            {t.xlg_add} · RM {total.toFixed(2)}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── SNACKS MENU ──────────────────────────────────────────────────────────────

// ─── SNACK UPSELL SHEET ───────────────────────────────────────────────────────

function SnackUpsellSheet({ onClose, onAdd, cart, lang = "zh" }) {
  const upsellSnacks = SNACKS.slice(0, 2); // 酱香饼 + 烤冷面
  const inCart = (id) => cart.some((c) => c.id === id);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1100, display: "flex", alignItems: "flex-end" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", padding: "20px 20px 36px", boxShadow: "0 -8px 32px rgba(0,0,0,0.15)" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, color: "#1a0a00" }}>
              {lang === "en" ? "Complete your meal" : "搭配更好吃"}
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
              {lang === "en" ? "Popular with this order" : "很多人都会加"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f5f5f5", border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 16, cursor: "pointer", color: "#999" }}>×</button>
        </div>

        {/* Snack cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upsellSnacks.map((snack) => {
            const added = inCart(snack.id);
            return (
              <div
                key={snack.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: added ? "#fff5f5" : "#faf8f5",
                  border: added ? "1.5px solid #e63946" : "1.5px solid #f0e6d3",
                  borderRadius: 14, padding: "12px 14px",
                  transition: "all 0.2s",
                }}
              >
                {/* Food image / emoji */}
                <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg, #fff5eb, #ffe0cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                  {snack.img}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "#1a0a00" }}>
                      {lang === "en" && snack.nameEn ? snack.nameEn : snack.name}
                    </span>
                    {snack.tag && (
                      <Tag variant={snack.tag === "热卖" ? "hot" : "gold"}>
                        {lang === "en" && snack.tagEn ? snack.tagEn : snack.tag}
                      </Tag>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#e63946" }}>
                    RM {snack.price.toFixed(2)}
                  </div>
                </div>

                {/* Add button */}
                <button
                  onClick={() => { if (!added) onAdd({ ...snack, addons: [], cartLabel: null }); }}
                  style={{
                    background: added ? "#e63946" : "linear-gradient(135deg, #8b0000, #e63946)",
                    color: "#fff", border: "none", borderRadius: 20,
                    padding: "8px 18px", fontSize: 13, fontWeight: 800,
                    cursor: added ? "default" : "pointer", whiteSpace: "nowrap",
                    minWidth: 64,
                  }}
                >
                  {added ? "✓" : `+ ${lang === "en" ? "Add" : "加入"}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Skip */}
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: 14, padding: "10px 0", background: "none", border: "none", fontSize: 13, color: "#bbb", cursor: "pointer" }}
        >
          {lang === "en" ? "No thanks, continue →" : "不用了，继续点餐 →"}
        </button>
      </div>
    </div>
  );
}

function SnacksMenu({ onAdd, cart, onUpdateQty, lang }) {
  const t = T[lang];
  return (
    <div>
      <div style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>{t.snacks_hint}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SNACKS.map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div key={item.id} style={{ background: "#fff", border: "1px solid #f0e6d3", borderRadius: 16, padding: "14px 14px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #fff5eb, #ffe0cc)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
                {item.img}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1a0a00" }}>{lang === "en" && item.nameEn ? item.nameEn : item.name}</span>
                  {item.tag && <Tag variant={item.tag === "热卖" ? "hot" : "gold"}>{lang === "en" && item.tagEn ? item.tagEn : item.tag}</Tag>}
                </div>
                {lang === "en" && item.nameEn && <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>{item.name}</div>}
                <div style={{ fontWeight: 800, fontSize: 15, color: "#e63946" }}>RM {item.price.toFixed(2)}</div>
              </div>
              {inCart ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => onUpdateQty(inCart.cartId, inCart.qty - 1)} style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #e63946", background: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#e63946", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontWeight: 800, fontSize: 14, minWidth: 18, textAlign: "center" }}>{inCart.qty}</span>
                  <button onClick={() => onUpdateQty(inCart.cartId, inCart.qty + 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#e63946", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              ) : (
                <button onClick={() => onAdd({ ...item, addons: [], cartLabel: null })} style={{ background: "#e63946", color: "#fff", border: "none", borderRadius: 24, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {t.add}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("menu"); // menu | checkout | payment | confirmation | admin
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("syj_cart") || "[]"); } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState("经典款");
  const [activeCategory, setActiveCategory] = useState("mlt"); // mlt | xlg | xc
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("syj_lang") || "zh"; } catch { return "zh"; }
  }); // zh | en
  useEffect(() => {
  setActiveCategory("mlt");
  setActiveTab("经典款");
}, []);

  const toggleLang = () => {
    const next = lang === "zh" ? "en" : "zh";
    setLang(next);
    try { localStorage.setItem("syj_lang", next); } catch {}
  };

  // Persist cart on every change
  useEffect(() => {
    try { localStorage.setItem("syj_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // Cart idle timer — starts when cart has items, resets on checkout or cart clear
  useEffect(() => {
    if (cart.length > 0 && page === "menu") {
      cartIdleRef.current = setInterval(() => {
        setCartIdleSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(cartIdleRef.current);
      setCartIdleSeconds(0);
    }
    return () => clearInterval(cartIdleRef.current);
  }, [cart.length, page]);

  const getCartRoast = () => {
    if (cartIdleSeconds < 180) return null; // first 3 min — no roast
    if (lang === "en") {
      if (cartIdleSeconds < 300) return "Still browsing? The bowl's getting cold 🥶";
      if (cartIdleSeconds < 480) return "小虎 is getting hungry… 🐯";
      return "Okay okay, we'll wait 😅";
    } else {
      if (cartIdleSeconds < 300) return "还在看？碗都凉了 🥶";
      if (cartIdleSeconds < 480) return "小虎等饿了… 🐯";
      return "好了好了，我们等你 😅";
    }
  };
  const [order, setOrder] = useState(null);
  const [paidOrders, setPaidOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(() => {
    try { return parseInt(localStorage.getItem("syj_order_count") || "0", 10); } catch { return 0; }
  });
  const [lastOrder, setLastOrder] = useState(() => {
    try { const s = localStorage.getItem("syj_last_order"); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [showCustomToast, setShowCustomToast] = useState(false);
  const [showSnackUpsell, setShowSnackUpsell] = useState(false);
  const upsellShownRef = useRef(false);
  const toastTimerRef = useRef(null);
  const [cartIdleSeconds, setCartIdleSeconds] = useState(0);
  const cartIdleRef = useRef(null);

  const t = T[lang];

  const tabs = ["经典款", "自选锅", "精品锅"];

  const showToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowCustomToast(true);
    toastTimerRef.current = setTimeout(() => setShowCustomToast(false), 3000);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowCustomToast(false);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      if (item.isCustom || (item.addons && item.addons.length > 0)) {
        return [...prev, { ...item, qty: 1, cartId: item.id + "_" + Date.now() }];
      }
      const exists = prev.find((c) => c.id === item.id && !c.addons?.length);
      if (exists) {
        return prev.map((c) => c.cartId === exists.cartId ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1, cartId: item.id + "_" + Date.now() }];
    });
    // Trigger snack upsell after first bowl add — once per session
    const snackIds = ["sn1","sn2","sn3","sn4","sn5"];
    const isBowl = !snackIds.includes(item.id);
    if (isBowl && !upsellShownRef.current) {
      upsellShownRef.current = true;
      setTimeout(() => setShowSnackUpsell(true), 400);
    }
  };

  const updateQty = (cartId, newQty) => {
    if (newQty < 1) {
      setCart((prev) => prev.filter((c) => c.cartId !== cartId));
    } else {
      setCart((prev) => prev.map((c) => c.cartId === cartId ? { ...c, qty: newQty } : c));
    }
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  const updateCartItem = (cartId, updatedItem) => {
    setCart((prev) => prev.map((c) => c.cartId === cartId ? { ...updatedItem, cartId } : c));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  if (page === "admin") return <AdminPanel orders={paidOrders} onExit={() => setPage("menu")} />;

  if (page === "checkout")
    return (
      <CheckoutPage
        cart={cart}
        lang={lang}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onContinueShopping={(tab) => { setPage("menu"); if (tab) setActiveTab(tab); }}
        onProceedToPayment={(orderData) => {
          setOrder(orderData);
          setPage("payment");
        }}
      />
    );
  if (page === "payment")
    return (
      <PaymentPage
        order={order}
        cart={cart}
        lang={lang}
        onSuccess={() => {
          const newOrder = {
            id: order.orderId,
            name: order.name,
            phone: order.phone,
            time: order.time,
            date: order.date === new Date().toISOString().split("T")[0] ? (lang === "en" ? "Today" : "今天") : order.date,
            status: "待处理",
            total: cart.reduce((s, i) => s + i.price * i.qty, 0),
            items: cart.map((i) => ({ name: i.name, nameEn: i.nameEn || i.name, qty: i.qty })),
          };
          setPaidOrders((prev) => [newOrder, ...prev]);
          const nextCount = orderCount + 1;
          setOrderCount(nextCount);
          try {
            localStorage.setItem("syj_order_count", String(nextCount));
            localStorage.setItem("syj_last_order", JSON.stringify({
              items: cart.map((i) => ({ name: i.name, nameEn: i.nameEn || i.name, price: i.price, qty: i.qty, id: i.id, img: i.img || null })),
              total: cart.reduce((s, i) => s + i.price * i.qty, 0),
              date: new Date().toLocaleDateString(),
            }));
          } catch {}
          setPage("confirmation");
        }}
        onBack={() => setPage("checkout")}
      />
    );
  if (page === "confirmation")
    return (
      <ConfirmationPage
        order={order}
        cart={cart}
        lang={lang}
        orderCount={orderCount}
        onDone={() => {
          setCart([]);
          setPage("menu");
        }}
      />
    );

  const getTimeBasedCopy = () => {
    const h = new Date().getHours();
    if (lang === "en") {
      if (h >= 6 && h < 10)  return { tag: "Good morning ☀️", sub: "Open from 10AM — order ahead" };
      if (h >= 10 && h < 12) return { tag: "Morning 🍜", sub: "Fresh start, hot bowl" };
      if (h >= 12 && h < 14) return { tag: "Lunch time 🍜", sub: "Quick order, fast pickup" };
      if (h >= 14 && h < 17) return { tag: "Afternoon slump?", sub: "A bowl fixes everything" };
      if (h >= 17 && h < 20) return { tag: "Dinner time 🔥", sub: "Order now, beat the queue" };
      if (h >= 20 && h < 22) return { tag: "Last orders 🔔", sub: "We close at 10PM — order fast" };
      return { tag: "We're closed for now 🌙", sub: "Order ahead for tomorrow pickup" };
    } else {
      if (h >= 6 && h < 10)  return { tag: "早上好 ☀️", sub: "10点开始 · 可以先预订" };
      if (h >= 10 && h < 12) return { tag: "上午好 🍜", sub: "正宗手艺 · 每日现煮" };
      if (h >= 12 && h < 14) return { tag: "午饭时间 🍜", sub: "快点，趁热" };
      if (h >= 14 && h < 17) return { tag: "下午了", sub: "来碗暖的，提提神" };
      if (h >= 17 && h < 20) return { tag: "晚饭时间 🔥", sub: "提前下单，少等一会" };
      if (h >= 20 && h < 22) return { tag: "最后时段 🔔", sub: "10点打烊 · 快来下单" };
      return { tag: "今天已打烊 🌙", sub: "可预订明天的取餐时间" };
    }
  };

  const timeCopy = getTimeBasedCopy();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf8f5",
        fontFamily: FONT.ui,
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        paddingBottom: 80,
      }}
    >
      {/* ── Hero Header ── */}
      <div style={{ position: "relative" }}>
        <div style={{
          background: "linear-gradient(150deg, #1a0400 0%, #3d0800 40%, #6b1000 70%, #8b2010 100%)",
          padding: "52px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}>

          {/* Decorative ring — right side, matches screenshot */}
          <div style={{
            position: "absolute", top: "10%", right: -60,
            width: 220, height: 220, borderRadius: "50%",
            border: "1px solid rgba(201,168,76,0.12)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "15%", right: -20,
            width: 140, height: 140, borderRadius: "50%",
            border: "1px solid rgba(201,168,76,0.08)",
            pointerEvents: "none",
          }} />

          {/* Lang toggle — top right */}
          <div
            onClick={toggleLang}
            style={{
              position: "absolute", top: 18, right: 18,
              width: 72, height: 28,
              borderRadius: 14,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(201,168,76,0.35)",
              cursor: "pointer",
              display: "flex", alignItems: "center",
              padding: "0 4px",
              boxSizing: "border-box",
              userSelect: "none",
              zIndex: 2,
            }}
          >
            <div style={{
              position: "absolute", top: 2,
              left: lang === "zh" ? 2 : 36,
              width: 30, height: 22,
              borderRadius: 11,
              background: "linear-gradient(135deg, #c9a84c, #f5d88a)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.25)",
              transition: "left 0.22s ease-out",
            }} />
            <span style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: lang === "zh" ? "#1a0a00" : "rgba(255,255,255,0.4)", zIndex: 1, transition: "color 0.22s" }}>中</span>
            <span style={{ flex: 1, textAlign: "center", fontSize: 10, fontWeight: 700, color: lang === "en" ? "#1a0a00" : "rgba(255,255,255,0.4)", zIndex: 1, transition: "color 0.22s" }}>EN</span>
          </div>

          {/* Eyebrow — time based */}
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: "rgba(245,216,138,0.75)",
            letterSpacing: 1,
            marginBottom: 14,
            position: "relative", zIndex: 2,
          }}>
            {timeCopy.tag}
          </div>

          {/* Brand name */}
          <div style={{
            fontFamily: lang === "en" ? FONT.ui : FONT.brand,
            fontSize: lang === "en" ? 52 : 52,
            fontWeight: lang === "en" ? 800 : 700,
            letterSpacing: lang === "en" ? 0 : 6,
            color: "#f5d88a",
            lineHeight: 1.05,
            position: "relative", zIndex: 2,
            marginBottom: 14,
            textTransform: "none",
          }}>
            {lang === "en" ? "Shuangyu" : "双瑜记"}
          </div>

          {/* Sub tagline — time based */}
          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.5)",
            marginBottom: 24,
            position: "relative", zIndex: 2,
            fontWeight: 400,
          }}>
            {timeCopy.sub}
          </div>

          {/* Badges row */}
          <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 2, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 11, fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
            }}>
              ⏰ {lang === "en" ? "10AM – 10PM" : "10AM – 10PM"}
            </div>
            <div
              onClick={() => window.open(BRAND.mapUrl, "_blank")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 20, padding: "5px 12px",
                fontSize: 11, fontWeight: 500,
                color: "rgba(255,255,255,0.65)",
                cursor: "pointer",
              }}
            >
              📍 Taman Salak South
            </div>
          </div>

          {/* White pull-up */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 48, background: "#faf8f5",
            borderRadius: "20px 20px 0 0",
          }} />
        </div>
      </div>

      {/* ── 今日推荐 — Floating featured card ── */}
      <div
        onClick={() => {
          setActiveCategory("mlt");
          setActiveTab("精品锅");
          setShowBuilder(false);
        }}
        style={{
          position: "relative",
          zIndex: 10,
          margin: "-28px 16px 16px",
          borderRadius: 22,
          boxShadow: "0 8px 28px rgba(26,10,0,0.1), 0 1px 4px rgba(26,10,0,0.06)",
          cursor: "pointer",
          transform: "scale(1)",
          transition: "transform 0.15s ease",
        }}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.98)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
      >
        <div style={{
          background: "linear-gradient(135deg, #fffaf4 0%, #fff8ee 50%, #fff3e0 100%)",
          border: "1px solid rgba(240,220,180,0.6)",
          borderRadius: 22,
          padding: "18px 20px 22px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Ambient glow top-right */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 160, height: 160, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          {/* Top row: label left, 查看→ right */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(192,57,43,0.07)",
              border: "1px solid rgba(192,57,43,0.15)",
              borderRadius: 20, padding: "4px 12px",
            }}>
              <span style={{ fontSize: 11, color: "#c0392b", fontWeight: 700 }}>
                {lang === "en" ? "Today's Pick" : "今日推荐"}
              </span>
            </div>

          </div>

          {/* Content row: image left, text right */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Image box — larger with soft glow */}
            <div style={{
              width: 80, height: 80, flexShrink: 0,
              background: "linear-gradient(135deg, #fff5eb, #ffd8a8)",
              borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 42,
              boxShadow: "0 4px 16px rgba(201,168,76,0.2)",
            }}>
              🦐
            </div>

            {/* Text stack */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: FONT.brand,
                fontSize: 18, fontWeight: 900,
                color: "#1a0a00", lineHeight: 1.2,
                marginBottom: 6,
              }}>
                {lang === "en" ? "Signature Pot" : "双瑜招牌锅"}
              </div>
              <div style={{
                fontSize: 12, color: "#8b6a5a",
                lineHeight: 1.6, marginBottom: 12,
              }}>
                {lang === "en" ? "Beef + Shrimp Paste + Crab Sticks · Double Broth" : "牛肉 + 虾滑 + 蟹棒 · 双拼底料"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#c0392b" }}>
                  RM 35.90
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: "rgba(201,168,76,0.14)",
                  color: "#7a5c00",
                  border: "1px solid rgba(201,168,76,0.3)",
                  borderRadius: 20, padding: "3px 10px",
                }}>
                  ⭐ {lang === "en" ? "No.1 Pick" : "人气No.1"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav: Category + Sub-tabs in one sticky block ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 101, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontFamily: FONT.ui }}>

        {/* Category bar */}
        <div style={{ borderBottom: "1px solid #f0e6d3", display: "flex" }}>
          {[
            { key: "mlt", label: t.categories.mlt },
            { key: "xlg", label: t.categories.xlg },
            { key: "xc", label: t.categories.xc },
          ].map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <div
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setShowBuilder(false); }}
                style={{ flex: 1, position: "relative", cursor: "pointer", textAlign: "center", padding: "13px 4px 11px", boxSizing: "border-box" }}
              >
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? "#e63946" : "#888", transition: "all 0.15s", userSelect: "none" }}>
                  {cat.label}
                </span>
                {active && (
                  <div style={{ position: "absolute", bottom: -1, left: "10%", right: "10%", height: 2.5, background: "#e63946", borderRadius: 2 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Sub-tabs — only for 麻辣烫 */}
        {activeCategory === "mlt" && (
          <div style={{ background: "#faf8f5", borderBottom: "1px solid #f0e6d3", display: "flex" }}>
            {[
              { key: "经典款", label: t.mlt_tabs.classic },
              { key: "自选锅", label: t.mlt_tabs.custom },
              { key: "精品锅", label: t.mlt_tabs.premium },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <div
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); if (tab.key === "自选锅") setShowBuilder(true); else setShowBuilder(false); }}
                  style={{ flex: 1, position: "relative", cursor: "pointer", textAlign: "center", padding: "9px 4px 7px", boxSizing: "border-box" }}
                >
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? "#8b0000" : "#aaa", transition: "all 0.15s", userSelect: "none" }}>
                    {tab.label}
                  </span>
                  {active && (
                    <div style={{ position: "absolute", bottom: -1, left: "10%", right: "10%", height: 2, background: "#8b0000", borderRadius: 2 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px 16px" }}>

        {/* ── Reorder card — returning users only ── */}
        {lastOrder && orderCount >= 1 && cart.length === 0 && (
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #f0e6d3",
              borderRadius: 16,
              padding: "14px 16px",
              marginBottom: 16,
              cursor: "pointer",
            }}
            onClick={() => {
              const reorderItems = lastOrder.items.map((i) => ({
                ...i,
                cartId: "cart_" + Date.now() + "_" + Math.random().toString(36).slice(2),
                addons: [],
              }));
              setCart(reorderItems);
              setLastOrder(null);
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#c9a84c", fontWeight: 700, letterSpacing: 1 }}>
                {lang === "en" ? "ORDER AGAIN" : "再来一单"}
              </div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{lastOrder.date}</div>
            </div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 10, lineHeight: 1.5 }}>
              {lastOrder.items.slice(0, 2).map((i) => (lang === "en" && i.nameEn ? i.nameEn : i.name)).join(", ")}
              {lastOrder.items.length > 2 && ` +${lastOrder.items.length - 2} ${lang === "en" ? "more" : "件"}`}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#e63946" }}>RM {lastOrder.total.toFixed(2)}</div>
              <div style={{ background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 800 }}>
                {lang === "en" ? "Reorder →" : "一键重订 →"}
              </div>
            </div>
          </div>
        )}

        {/* ── 麻辣烫 Content ── */}
        {activeCategory === "mlt" && (
          <>
            {activeTab === "经典款" && (
              <div>
                <div style={{ fontSize: 13, color: "#999", marginBottom: 14 }}>{t.classic_hint}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {PRESET_BOWLS.map((item) => (
                    <FoodCard key={item.id} item={item} onAdd={addToCart} onUpdateQty={updateQty} onRemove={removeFromCart} cartItems={cart} lang={lang} />
                  ))}
                </div>
              </div>
            )}
            {activeTab === "自选锅" && !showBuilder && (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🍜</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#1a0a00", marginBottom: 8 }}>{t.custom_title}</div>
                <div style={{ fontSize: 13, color: "#999", marginBottom: 24, lineHeight: 1.7 }}>{t.custom_sub.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</div>
                <button onClick={() => setShowBuilder(true)} style={{ background: "linear-gradient(135deg, #8b0000, #e63946)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                  {t.custom_start}
                </button>
              </div>
            )}
            {activeTab === "精品锅" && (
              <div>
                <div style={{ background: "linear-gradient(135deg, #1a0a00, #3d1a00)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 24 }}>👑</span>
                  <div>
                    <div style={{ color: "#f5d88a", fontWeight: 800, fontSize: 14 }}>{t.premium_title}</div>
                    <div style={{ color: "#c9a84c", fontSize: 11 }}>{t.premium_sub}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {PREMIUM_BOWLS.map((item) => (
                    <FoodCard key={item.id} item={item} onAdd={addToCart} onUpdateQty={updateQty} onRemove={removeFromCart} cartItems={cart} isPremium lang={lang} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── 麻辣香锅 Content ── */}
        {activeCategory === "xlg" && (
          <XianguoBuilder
            lang={lang}
            onAdd={(item) => {
              addToCart(item);
              showToast();
            }}
          />
        )}

        {/* ── 小吃 Content ── */}
        {activeCategory === "xc" && (
          <SnacksMenu lang={lang} onAdd={addToCart} cart={cart} onUpdateQty={updateQty} />
        )}

      </div>

      {/* Custom Bowl Builder Modal */}
      {showBuilder && (
        <CustomBowlBuilder
          lang={lang}
          onAdd={(item) => {
            addToCart(item);
            setShowBuilder(false);
            setActiveTab("经典款");
            showToast();
          }}
          onClose={() => {
            setShowBuilder(false);
            setActiveTab("经典款");
          }}
        />
      )}

      {/* Cart Drawer */}
      {showCart && (
        <CartDrawer
          cart={cart}
          lang={lang}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateCart={updateCartItem}
          onAddItem={(item) => addToCart(item)}
          onCheckout={() => {
            setShowCart(false);
            setPage("checkout");
          }}
        />
      )}

      {/* Snack upsell sheet — appears after first bowl add */}
      {showSnackUpsell && (
        <SnackUpsellSheet
          lang={lang}
          cart={cart}
          onAdd={(item) => { addToCart(item); }}
          onClose={() => setShowSnackUpsell(false)}
        />
      )}

      {/* Custom bowl toast */}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(12px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
      {showCustomToast && (
        <div
          onClick={dismissToast}
          style={{
            position: "fixed",
            bottom: cart.length > 0 ? 76 : 52,
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 32px)",
            maxWidth: 448,
            zIndex: 300,
            background: "#1a0a00",
            borderRadius: 14,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <span style={{ color: "#f5d88a", fontSize: 13, fontWeight: 600 }}>
            {T[lang].added}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissToast();
              setShowBuilder(true);
              setActiveTab("自选锅");
            }}
            style={{
              background: "#e63946",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {T[lang].again}
          </button>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 480,
            padding: "11px 16px",
            background: "rgba(139,0,0,0.92)",
            borderTop: "1px solid rgba(201,168,76,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 200,
            boxShadow: "0 -2px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Left: paw ring + count + price */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              onClick={() => setShowCart(true)}
              style={{
                width: 38, height: 38,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(245,216,138,0.92)">
                <ellipse cx="6" cy="5.5" rx="2.2" ry="2.8"/>
                <ellipse cx="12" cy="4" rx="2.2" ry="2.8"/>
                <ellipse cx="18" cy="5.5" rx="2.2" ry="2.8"/>
                <path d="M4.5 13.5c0-3.5 3-5.5 7.5-5.5s7.5 2 7.5 5.5c0 2.8-2 4.5-7.5 4.5s-7.5-1.7-7.5-4.5z"/>
                <ellipse cx="9" cy="15" rx="1.1" ry="1.4"/>
                <ellipse cx="12" cy="16" rx="1.1" ry="1.4"/>
                <ellipse cx="15" cy="15" rx="1.1" ry="1.4"/>
              </svg>
              <div style={{
                position: "absolute", top: -4, right: -4,
                width: 17, height: 17,
                background: "#c9a84c",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800, color: "#1a0a00",
                border: "1.5px solid rgba(139,0,0,0.9)",
              }}>
                {itemCount}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: getCartRoast() ? "#c9a84c" : "rgba(255,255,255,0.5)", fontWeight: 600, transition: "color 0.3s" }}>
                {getCartRoast() || (lang === "en" ? `${itemCount} item${itemCount !== 1 ? "s" : ""}` : `${itemCount} 件已加入`)}
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#f5d88a", lineHeight: 1.2 }}>
                RM {total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Right: checkout CTA */}
          <button
            onClick={() => setPage("checkout")}
            style={{
              background: "#f5d88a",
              border: "none",
              borderRadius: 22,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 800,
              color: "#1a0a00",
              cursor: "pointer",
              letterSpacing: 0.5,
            }}
          >
            {lang === "en" ? "Checkout →" : "去结算 →"}
          </button>
        </div>
      )}

      {/* Empty state bottom prompt */}
      {cart.length === 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 480,
            padding: "12px 20px",
            background: "#fff",
            borderTop: "1px solid #f0e6d3",
            textAlign: "center",
            fontSize: 12,
            color: "#ccc",
          }}
        >
          {lang === "en" ? "Pick something good" : "选一碗，马上开吃"}
        </div>
      )}
    </div>
  );
}
