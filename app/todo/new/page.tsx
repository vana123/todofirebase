"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { AuthContext } from "@/contexts/AuthContext";

// Типи додатку
export type todoItem = {
  title: string;
  description: string;
  completed: boolean;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  admin: string;
  viewers: string[]; // Масив з Gmail адрес користувачів з роллю Viewer
  items: todoItem[];
};

const TodoForm = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const todoId = Array.isArray(idParam) ? idParam[0] : idParam;

  // Стани для полів Todo
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [items, setItems] = useState<todoItem[]>([]);
  const [viewers, setViewers] = useState<string[]>([]);

  // Стани для додавання нового елемента todoItem
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

  // Стани для додавання нового Viewer
  const [newViewerEmail, setNewViewerEmail] = useState("");

  // Стани помилок
  const [error, setError] = useState("");

  // Завантаження існуючого Todo для редагування
  useEffect(() => {
    if (todoId && user) {
      const docRef = doc(db, "todos", todoId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || "");
            setDescription(data.description || "");
            setCompleted(data.completed || false);
            setItems(data.items || []);
            setViewers(data.viewers || []);
          } else {
            setError("To-Do не знайдено");
          }
        })
        .catch((err) => setError(err.message));
    }
  }, [todoId, user]);

  // Додавання нового todoItem
  const addItem = () => {
    if (newItemTitle.trim() === "") return;
    const newItem: todoItem = {
      title: newItemTitle,
      description: newItemDescription,
      completed: false,
    };
    setItems([...items, newItem]);
    setNewItemTitle("");
    setNewItemDescription("");
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Додавання нового Viewer з перевіркою Gmail
  const addViewer = () => {
    const email = newViewerEmail.trim().toLowerCase();
    if (!email) return;

    // Мінімальна валідація: перевірка формату та домену gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !email.endsWith("@gmail.com")) {
      setError("Введіть дійсний Gmail адрес");
      return;
    }
    if (viewers.includes(email)) {
      setError("Цей користувач вже доданий");
      return;
    }
    setViewers([...viewers, email]);
    setNewViewerEmail("");
    setError("");
  };

  const removeViewer = (index: number) => {
    setViewers(viewers.filter((_, i) => i !== index));
  };

  // Обробка форми: створення нового або оновлення існуючого Todo
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (todoId) {
        // Режим редагування: оновлення документа
        const docRef = doc(db, "todos", todoId);
        await updateDoc(docRef, {
          title,
          description,
          completed,
          items,
          viewers,
        });
      } else {
        // Режим створення нового Todo – creator автоматично стає Admin
        await addDoc(collection(db, "todos"), {
          title,
          description,
          completed,
          admin: user.uid,
          viewers,
          items,
        });
      }
      router.push("/Dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        {todoId ? "Редагувати To-Do" : "Створити нове To-Do"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Опис"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 border rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Виконано
        </label>

        {/* Розділ для управління елементами todoItem */}
        <div className="border p-2 rounded">
          <h2 className="font-semibold">Елементи To-Do</h2>
          {items.length === 0 ? (
            <p>Поки немає елементів.</p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b py-1">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm">{item.description}</p>
                    <p className="text-sm">
                      Виконано: {item.completed ? "Так" : "Ні"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500"
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2">
            <input
              type="text"
              placeholder="Заголовок елемента"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />
            <textarea
              placeholder="Опис елемента"
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />
            <button
              type="button"
              onClick={addItem}
              className="p-2 bg-green-500 text-white rounded"
            >
              Додати елемент
            </button>
          </div>
        </div>

        {/* Розділ для управління Viewer користувачами */}
        <div className="border p-2 rounded mt-4">
          <h2 className="font-semibold">
            Viewer (додати користувача за Gmail)
          </h2>
          {viewers.length === 0 ? (
            <p>Немає доданих користувачів.</p>
          ) : (
            <ul>
              {viewers.map((email, index) => (
                <li key={index} className="flex justify-between items-center border-b py-1">
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeViewer(index)}
                    className="text-red-500"
                  >
                    Видалити
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2">
            <input
              type="email"
              placeholder="Введіть Gmail"
              value={newViewerEmail}
              onChange={(e) => setNewViewerEmail(e.target.value)}
              className="p-2 border rounded mb-2 w-full"
            />
            <button
              type="button"
              onClick={addViewer}
              className="p-2 bg-green-500 text-white rounded"
            >
              Додати Viewer
            </button>
          </div>
        </div>

        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {todoId ? "Оновити To-Do" : "Створити To-Do"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default TodoForm;
