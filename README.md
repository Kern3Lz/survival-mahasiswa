# 🎮 Survival Mahasiswa: Semester Sanity

## Card Battle Edition dengan Struktur Data

Game RPG Turn-Based dengan sistem kartu yang mengimplementasikan **OOP** dan **Struktur Data**.

---

## 📊 Penerapan Struktur Data (Nilai Jual Utama)

### 1. Draw Pile = STACK (LIFO)

**File:** `js/structures/Stack.js`

```javascript
class Stack {
  #items;

  push(item) {
    this.#items.push(item); // Tambah ke atas
  }

  pop() {
    return this.#items.pop(); // Ambil dari atas (LIFO)
  }

  peek() {
    return this.#items[this.#items.length - 1]; // Lihat atas
  }
}
```

**Penggunaan:**

```javascript
// Setup deck - PUSH semua kartu
starterDeck.forEach((card) => drawPile.push(card));
drawPile.shuffle();

// Draw kartu - POP dari atas
const card = drawPile.pop();
hand.push(card);
```

**Kenapa Stack?** Kartu diambil dari posisi paling atas tumpukan (seperti tumpukan kartu fisik).

---

### 2. Discard Pile = STACK (LIFO)

**Penggunaan:**

```javascript
// Buang kartu - PUSH ke atas discard
discardPile.push(usedCard);

// Saat reshuffle - TRANSFER ke draw pile
discardPile.transferTo(drawPile);
drawPile.shuffle();
```

**Kenapa Stack?** Kartu yang baru dibuang ada di atas tumpukan.

---

### 3. Action History = QUEUE (FIFO)

**File:** `js/structures/Queue.js`

```javascript
class Queue {
  #items;

  enqueue(item) {
    this.#items.push(item); // Tambah di belakang
  }

  dequeue() {
    return this.#items.shift(); // Ambil dari depan (FIFO)
  }

  front() {
    return this.#items[0]; // Lihat depan
  }
}
```

**Penggunaan:**

```javascript
// Log aksi - ENQUEUE di belakang
actionHistory.enqueue({
  type: "PLAY_CARD",
  card: "Strike",
  timestamp: Date.now(),
});

// Proses aksi - DEQUEUE dari depan (urutan)
while (!actionHistory.isEmpty()) {
  const action = actionHistory.dequeue();
  processAction(action);
}
```

**Kenapa Queue?** Aksi dieksekusi sesuai urutan masuk (First In, First Out).

---

### 4. Hand (Kartu di Tangan) = ARRAY/LIST

**Penggunaan:**

```javascript
// Random access - pilih kartu manapun
const selectedCard = hand[2]; // Ambil kartu ke-3

// Remove dari posisi mana saja
hand.splice(index, 1);

// Add kartu baru
hand.push(newCard);
```

**Kenapa Array?** Pemain bisa memilih kartu di posisi mana saja (random access).

---

## 🔄 Siklus Deck (Reshuffle Logic)

```
┌─────────────────────────────────────────────┐
│                                             │
│   DRAW PILE (Stack)                         │
│   ┌─────┐                                   │
│   │ Card│ ← pop() saat draw                │
│   │ Card│                                   │
│   │ Card│                                   │
│   └─────┘                                   │
│      │                                      │
│      ▼ draw                                 │
│   ┌─────────────┐                          │
│   │    HAND     │ (Array)                  │
│   │ [C1,C2,C3]  │ ← random access          │
│   └─────────────┘                          │
│      │                                      │
│      ▼ play/discard                        │
│   ┌─────┐                                   │
│   │ Card│ ← push() saat discard            │
│   │ Card│                                   │
│   │ Card│                                   │
│   └─────┘                                   │
│   DISCARD PILE (Stack)                      │
│      │                                      │
│      └──────── reshuffle ──────────┐       │
│         (jika Draw Pile kosong)     │       │
│                                     ▲       │
└─────────────────────────────────────────────┘
```

**Kode Reshuffle:**

```javascript
reshuffleDeck() {
    if (drawPile.isEmpty() && !discardPile.isEmpty()) {
        // Transfer semua dari Discard ke Draw
        discardPile.transferTo(drawPile);

        // Shuffle
        drawPile.shuffle();

        console.log('♻️ Deck reshuffled!');
    }
}
```

---

## ⚡ Sistem Energy (Mana)

| Kartu         | Cost | Effect                  |
| ------------- | ---- | ----------------------- |
| Strike        | 1    | Deal 5 damage           |
| Big Slash     | 2    | Deal 12 damage          |
| Block         | 1    | Gain 5 Shield           |
| Heal          | 1    | Restore 8 HP            |
| Double Strike | 1    | Deal 4 damage x2        |
| Heavy Blow    | 3    | Deal 20 damage, Exhaust |

**Energy per Turn:** 3

```javascript
playCard(handIndex) {
    const card = hand[handIndex];

    // Cek energy
    if (currentEnergy < card.cost) {
        return { error: 'Not enough energy!' };
    }

    // Kurangi energy
    currentEnergy -= card.cost;

    // Execute effect
    executeCardEffect(card);

    // Buang ke discard pile
    discardPile.push(card);
}
```

---

## 🏗️ Struktur OOP

### Diagram Class

```
         MakhlukHidup (Parent)
        ┌───────────────────────┐
        │ - nama                │
        │ - max_sanity          │
        │ - curr_sanity         │
        │ - base_attack         │
        ├───────────────────────┤
        │ + take_damage()       │
        │ + is_alive()          │
        │ + heal()              │
        └───────────────────────┘
               ▲       ▲
     ┌─────────┘       └─────────┐
     │                           │
┌────────────────┐    ┌────────────────┐
│   Mahasiswa    │    │    Masalah     │
│   (Player)     │    │    (Enemy)     │
├────────────────┤    ├────────────────┤
│ - energi_kopi  │    │ - tipe_masalah │
│ - semester     │    │ - drop_item    │
│ - inventory    │    │ - attack_pat.  │
│ - skills       │    │ - isBoss       │
├────────────────┤    ├────────────────┤
│ + use_skill()  │    │ + attack_pat() │
│ + minum_kopi() │    │ + executeAtk() │
│ + belajar()    │    │ + getRewards() │
└────────────────┘    └────────────────┘
```

### Konsep OOP yang Diterapkan

1. **Encapsulation** - Private fields dengan `#`
2. **Inheritance** - Mahasiswa/Masalah extends MakhlukHidup
3. **Polymorphism** - Override `take_damage()`, `calculateDamage()`

---

## 📁 Struktur File

```
GrafKom/
├── index.html
├── styles.css
├── README.md
└── js/
    ├── structures/
    │   ├── Stack.js      ← STACK implementation
    │   └── Queue.js      ← QUEUE implementation
    ├── classes/
    │   ├── MakhlukHidup.js
    │   ├── Mahasiswa.js
    │   ├── Masalah.js
    │   └── Card.js
    ├── data/
    │   ├── cards.js
    │   ├── enemies.js
    │   ├── items.js
    │   └── skills.js
    ├── game/
    │   ├── DeckSystem.js      ← Uses Stack & Queue
    │   ├── CardBattleSystem.js
    │   └── GameManager.js
    └── main.js
```

---

## 🎮 Cara Bermain

1. **Buat Karakter** - Pilih nama dan jurusan
2. **Pilih Stage** - Stage 1 tersedia, lainnya unlock setelah boss
3. **Battle dengan Kartu:**
   - Setiap turn dapat 3 Energy
   - Draw 5 kartu dari Draw Pile
   - Mainkan kartu dengan klik (cek cost)
   - Klik "End Turn" untuk giliran musuh
   - Kartu terpakai masuk Discard Pile
4. **Kalahkan Boss** untuk unlock stage berikutnya
5. **Wisuda** setelah clear semua 3 stage!

---

## 🎓 Untuk Penilaian Dosen

### ✅ Struktur Data

- [x] **Stack (LIFO)** - Draw Pile & Discard Pile
- [x] **Queue (FIFO)** - Action History
- [x] **Array** - Hand (kartu di tangan)

### ✅ OOP

- [x] **Inheritance** - Child extends Parent
- [x] **Polymorphism** - Method overriding
- [x] **Encapsulation** - Private fields

### ✅ Gameplay

- [x] Energy/Mana system
- [x] Card cost mechanics
- [x] Reshuffle logic
- [x] Turn-based combat

---

**Dibuat dengan ❤️ dan ☕**
