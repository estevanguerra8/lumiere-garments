// ============================================================
// Lumière Garments — SQLite Database
// Real SQL database using better-sqlite3. Creates tables with
// proper foreign keys, seeds data on first run, and exposes
// the connection as a singleton via globalThis.
// ============================================================

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// In production (Docker), use /app/data/ which is writable.
// In development, use the project root.
const DATA_DIR = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'data')
  : process.cwd();

// Ensure the directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'lumiere.db');

// ---------------------------------------------------------------------------
// Singleton — survives Next.js hot-reload in dev via globalThis
// ---------------------------------------------------------------------------
const g = globalThis as unknown as {
  __sqliteDb: Database.Database;
  __dbVersion: number;
};

function initializeDatabase(): Database.Database {
  const db = new Database(DB_PATH);

  // Performance & safety pragmas
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // ---------------------------------------------------------------
  // CREATE TABLES
  // ---------------------------------------------------------------
  db.exec(`
    CREATE TABLE IF NOT EXISTS COLLECTION (
      CollectionID  INTEGER PRIMARY KEY,
      Name          TEXT NOT NULL,
      ReleaseDate   TEXT NOT NULL,
      Season        TEXT NOT NULL,
      Theme         TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS PRODUCT (
      ProductID     INTEGER PRIMARY KEY,
      CollectionID  INTEGER NOT NULL,
      Name          TEXT NOT NULL,
      Size          TEXT NOT NULL,
      Color         TEXT NOT NULL,
      RetailPrice   REAL NOT NULL,
      ImageUrl      TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (CollectionID) REFERENCES COLLECTION(CollectionID)
    );

    CREATE TABLE IF NOT EXISTS SUPPLIER (
      SupplierID    INTEGER PRIMARY KEY,
      CompanyName   TEXT NOT NULL,
      Country       TEXT NOT NULL,
      ContactInfo   TEXT NOT NULL,
      MaterialType  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS MANUFACTURER (
      ManufacturerID    INTEGER PRIMARY KEY,
      Name              TEXT NOT NULL,
      Location          TEXT NOT NULL,
      ProductionCapacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS WAREHOUSE (
      WarehouseID     INTEGER PRIMARY KEY,
      Location        TEXT NOT NULL,
      StorageCapacity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS CUSTOMER (
      CustomerID        INTEGER PRIMARY KEY,
      Name              TEXT NOT NULL,
      Email             TEXT NOT NULL,
      ShippingAddress   TEXT NOT NULL,
      RegistrationDate  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS PRODUCT_SUPPLIER (
      ProductID   INTEGER NOT NULL,
      SupplierID  INTEGER NOT NULL,
      PRIMARY KEY (ProductID, SupplierID),
      FOREIGN KEY (ProductID)  REFERENCES PRODUCT(ProductID),
      FOREIGN KEY (SupplierID) REFERENCES SUPPLIER(SupplierID)
    );

    CREATE TABLE IF NOT EXISTS PRODUCTION_BATCH (
      BatchID           INTEGER PRIMARY KEY,
      ProductID         INTEGER NOT NULL,
      ManufacturerID    INTEGER NOT NULL,
      ProductionDate    TEXT NOT NULL,
      QuantityProduced  INTEGER NOT NULL,
      CostPerUnit       REAL NOT NULL,
      FOREIGN KEY (ProductID)      REFERENCES PRODUCT(ProductID),
      FOREIGN KEY (ManufacturerID) REFERENCES MANUFACTURER(ManufacturerID)
    );

    CREATE TABLE IF NOT EXISTS INVENTORY (
      ProductID   INTEGER NOT NULL,
      WarehouseID INTEGER NOT NULL,
      Quantity    INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (ProductID, WarehouseID),
      FOREIGN KEY (ProductID)   REFERENCES PRODUCT(ProductID),
      FOREIGN KEY (WarehouseID) REFERENCES WAREHOUSE(WarehouseID)
    );

    CREATE TABLE IF NOT EXISTS "ORDER" (
      OrderID       INTEGER PRIMARY KEY AUTOINCREMENT,
      CustomerID    INTEGER NOT NULL,
      OrderDate     TEXT NOT NULL,
      TotalAmount   REAL NOT NULL,
      PaymentStatus TEXT NOT NULL CHECK(PaymentStatus IN ('Paid', 'Pending', 'Failed')),
      FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
    );

    CREATE TABLE IF NOT EXISTS ORDER_LINE (
      OrderID   INTEGER NOT NULL,
      ProductID INTEGER NOT NULL,
      Quantity  INTEGER NOT NULL,
      SalePrice REAL NOT NULL,
      PRIMARY KEY (OrderID, ProductID),
      FOREIGN KEY (OrderID)   REFERENCES "ORDER"(OrderID),
      FOREIGN KEY (ProductID) REFERENCES PRODUCT(ProductID)
    );
  `);

  // ---------------------------------------------------------------
  // SEED DATA — only if tables are empty
  // ---------------------------------------------------------------
  const count = (db.prepare('SELECT COUNT(*) AS n FROM PRODUCT').get() as { n: number }).n;

  if (count === 0) {
    const seed = db.transaction(() => {
      // -- COLLECTION
      const insCol = db.prepare(
        'INSERT INTO COLLECTION (CollectionID, Name, ReleaseDate, Season, Theme) VALUES (?, ?, ?, ?, ?)'
      );
      insCol.run(1, 'Winter Noir 2026', '2026-01-20', 'Winter', 'Dark luxury streetwear');
      insCol.run(2, 'Solar Flux 2026', '2026-04-15', 'Spring', 'Futuristic bright aesthetics');

      // -- PRODUCT
      const insProd = db.prepare(
        'INSERT INTO PRODUCT (ProductID, CollectionID, Name, Size, Color, RetailPrice, ImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      insProd.run(1, 1, 'Oversized Cargo Jacket', 'M', 'Black',    220, 'https://images.pexels.com/photos/983497/pexels-photo-983497.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');
      insProd.run(2, 1, 'Oversized Cargo Jacket', 'L', 'Black',    220, 'https://images.pexels.com/photos/1954861/pexels-photo-1954861.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');
      insProd.run(3, 1, 'Heavyweight Hoodie',     'M', 'Charcoal', 145, 'https://images.pexels.com/photos/32430590/pexels-photo-32430590.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');
      insProd.run(4, 2, 'Boxy Graphic Tee',       'M', 'White',     85, 'https://images.pexels.com/photos/6786616/pexels-photo-6786616.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');
      insProd.run(5, 2, 'Boxy Graphic Tee',       'L', 'Orange',    85, 'https://images.pexels.com/photos/2221132/pexels-photo-2221132.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');
      insProd.run(6, 2, 'Utility Pants',           'M', 'Olive',    160, 'https://images.pexels.com/photos/19461561/pexels-photo-19461561.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop');

      // -- SUPPLIER
      const insSup = db.prepare(
        'INSERT INTO SUPPLIER (SupplierID, CompanyName, Country, ContactInfo, MaterialType) VALUES (?, ?, ?, ?, ?)'
      );
      insSup.run(1, 'Tokyo Textile Group', 'Japan',        'tokyo@email.com', 'Cotton');
      insSup.run(2, 'Milan Dye Works',     'Italy',        'milan@email.com', 'Dye');
      insSup.run(3, 'Seoul Trim Source',   'South Korea',  'seoul@email.com', 'Zippers');

      // -- MANUFACTURER
      const insMfg = db.prepare(
        'INSERT INTO MANUFACTURER (ManufacturerID, Name, Location, ProductionCapacity) VALUES (?, ?, ?, ?)'
      );
      insMfg.run(1, 'Apex Garment House', 'Los Angeles USA', 12000);
      insMfg.run(2, 'Nero Manufacturing', 'Portugal',        8500);

      // -- WAREHOUSE
      const insWh = db.prepare(
        'INSERT INTO WAREHOUSE (WarehouseID, Location, StorageCapacity) VALUES (?, ?, ?)'
      );
      insWh.run(1, 'Dallas Texas',             20000);
      insWh.run(2, 'Los Angeles California',   15000);

      // -- CUSTOMER
      const insCust = db.prepare(
        'INSERT INTO CUSTOMER (CustomerID, Name, Email, ShippingAddress, RegistrationDate) VALUES (?, ?, ?, ?, ?)'
      );
      insCust.run(1, 'Taylor Phan',    'tayvon@example.com',   'Garland TX',       '2026-02-01');
      insCust.run(2, 'Aastha Tyagi',   'aastha@example.com',   'Dallas TX',        '2026-02-05');
      insCust.run(3, 'Minhao Ni',      'minhao@example.com',   'Plano TX',         '2026-02-12');
      insCust.run(4, 'Jordan Reeves',  'jordan@example.com',   'Austin TX',        '2026-02-18');
      insCust.run(5, 'Priya Sharma',   'priya@example.com',    'Frisco TX',        '2026-03-01');
      insCust.run(6, 'Marcus Bell',    'marcus@example.com',   'Richardson TX',    '2026-03-08');
      insCust.run(7, 'Sofia Chen',     'sofia@example.com',    'Irving TX',        '2026-03-15');
      insCust.run(8, 'Elijah Brooks',  'elijah@example.com',   'McKinney TX',      '2026-03-22');

      // -- PRODUCT_SUPPLIER
      const insPS = db.prepare(
        'INSERT INTO PRODUCT_SUPPLIER (ProductID, SupplierID) VALUES (?, ?)'
      );
      insPS.run(1, 1); insPS.run(2, 1); insPS.run(3, 1);
      insPS.run(4, 1); insPS.run(5, 1); insPS.run(3, 2);
      insPS.run(4, 2); insPS.run(1, 3); insPS.run(6, 3);

      // -- PRODUCTION_BATCH
      const insBatch = db.prepare(
        'INSERT INTO PRODUCTION_BATCH (BatchID, ProductID, ManufacturerID, ProductionDate, QuantityProduced, CostPerUnit) VALUES (?, ?, ?, ?, ?, ?)'
      );
      insBatch.run(1, 1, 1, '2026-01-05', 300, 95);
      insBatch.run(2, 2, 1, '2026-01-06', 250, 95);
      insBatch.run(3, 3, 2, '2026-01-10', 400, 52);
      insBatch.run(4, 4, 2, '2026-04-01', 500, 20);
      insBatch.run(5, 5, 2, '2026-04-02', 450, 20);
      insBatch.run(6, 6, 1, '2026-04-03', 200, 70);

      // -- INVENTORY (starting stock minus fulfilled orders above)
      const insInv = db.prepare(
        'INSERT INTO INVENTORY (ProductID, WarehouseID, Quantity) VALUES (?, ?, ?)'
      );
      insInv.run(1, 1, 116); insInv.run(1, 2, 80);   // Cargo Jacket M: sold 4
      insInv.run(2, 1, 98);                            // Cargo Jacket L: sold 2
      insInv.run(3, 1, 215); insInv.run(3, 2, 100);   // Hoodie: sold 5
      insInv.run(4, 1, 178);                           // Graphic Tee M: sold 2
      insInv.run(5, 2, 158);                           // Graphic Tee L: sold 2
      insInv.run(6, 1, 85);                            // Utility Pants: sold 5

      // -- ORDER (12 orders spread across recent weeks, mix of statuses)
      const insOrd = db.prepare(
        'INSERT INTO "ORDER" (OrderID, CustomerID, OrderDate, TotalAmount, PaymentStatus) VALUES (?, ?, ?, ?, ?)'
      );
      insOrd.run(1,  1, '2026-04-02', 245,  'Paid');
      insOrd.run(2,  2, '2026-04-05', 220,  'Paid');
      insOrd.run(3,  3, '2026-04-07', 170,  'Paid');
      insOrd.run(4,  4, '2026-04-10', 380,  'Paid');
      insOrd.run(5,  5, '2026-04-12', 305,  'Paid');
      insOrd.run(6,  6, '2026-04-14', 85,   'Paid');
      insOrd.run(7,  7, '2026-04-17', 525,  'Paid');
      insOrd.run(8,  8, '2026-04-19', 160,  'Paid');
      insOrd.run(9,  1, '2026-04-21', 290,  'Paid');
      insOrd.run(10, 3, '2026-04-23', 440,  'Paid');
      insOrd.run(11, 5, '2026-04-25', 365,  'Pending');
      insOrd.run(12, 2, '2026-04-27', 145,  'Pending');

      // -- ORDER_LINE (each order has 1-3 line items)
      const insOL = db.prepare(
        'INSERT INTO ORDER_LINE (OrderID, ProductID, Quantity, SalePrice) VALUES (?, ?, ?, ?)'
      );
      // Order 1 — Taylor: Graphic Tee + Utility Pants
      insOL.run(1, 4, 1, 85);
      insOL.run(1, 6, 1, 160);
      // Order 2 — Aastha: Cargo Jacket (M)
      insOL.run(2, 1, 1, 220);
      // Order 3 — Minhao: 2x Graphic Tee (L)
      insOL.run(3, 5, 2, 85);
      // Order 4 — Jordan: Cargo Jacket (L) + Utility Pants
      insOL.run(4, 2, 1, 220);
      insOL.run(4, 6, 1, 160);
      // Order 5 — Priya: Hoodie + Utility Pants
      insOL.run(5, 3, 1, 145);
      insOL.run(5, 6, 1, 160);
      // Order 6 — Marcus: Graphic Tee (M)
      insOL.run(6, 4, 1, 85);
      // Order 7 — Sofia: Cargo Jacket (M) + Hoodie + Utility Pants
      insOL.run(7, 1, 1, 220);
      insOL.run(7, 3, 1, 145);
      insOL.run(7, 6, 1, 160);
      // Order 8 — Elijah: Utility Pants
      insOL.run(8, 6, 1, 160);
      // Order 9 — Taylor (repeat): Hoodie + Hoodie (gift)
      insOL.run(9, 3, 2, 145);
      // Order 10 — Minhao (repeat): 2x Cargo Jacket (M)
      insOL.run(10, 1, 2, 220);
      // Order 11 — Priya (repeat): Cargo Jacket (L) + Hoodie
      insOL.run(11, 2, 1, 220);
      insOL.run(11, 3, 1, 145);
      // Order 12 — Aastha (repeat): Hoodie
      insOL.run(12, 3, 1, 145);
    });

    seed();
  }

  return db;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
if (!g.__sqliteDb) {
  g.__sqliteDb = initializeDatabase();
  g.__dbVersion = 0;
}

export const db = g.__sqliteDb;

export function getVersion(): number {
  return g.__dbVersion;
}

export function bumpVersion(): number {
  return ++g.__dbVersion;
}
