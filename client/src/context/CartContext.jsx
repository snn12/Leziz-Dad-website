import { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.find((it) => it.id === action.item.id);
      if (existing) {
        return state.map((it) =>
          it.id === action.item.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "remove":
      return state.filter((it) => it.id !== action.id);
    case "setQty":
      return state.map((it) =>
        it.id === action.id ? { ...it, qty: Math.max(1, action.qty) } : it
      );
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem("leziz-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("leziz-cart", JSON.stringify(items));
  }, [items]);

  const add = (item) => dispatch({ type: "add", item });
  const remove = (id) => dispatch({ type: "remove", id });
  const setQty = (id, qty) => dispatch({ type: "setQty", id, qty });
  const clear = () => dispatch({ type: "clear" });

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const count = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}