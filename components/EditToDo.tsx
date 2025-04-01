"use client";

import { useState, useEffect, useContext, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { AuthContext } from "@/contexts/AuthContext";

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
    viewers: string[];
    items: todoItem[];
};

const TodoForm = () => {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();
    const params = useParams();
    const idParam = params?.id;
    const todoId = Array.isArray(idParam) ? idParam[0] : idParam;

    // Стан для основних полів Todo
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [items, setItems] = useState<todoItem[]>([]);
    const [viewers, setViewers] = useState<string[]>([]);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedItemTitle, setEditedItemTitle] = useState("");

    const [newItemTitle, setNewItemTitle] = useState("");

    const [newViewerEmail, setNewViewerEmail] = useState("");

    const [error, setError] = useState("");

    const [canEdit, setCanEdit] = useState(false)

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
                        setCanEdit(data.admin === user.uid);
                    } else {
                        setError("To-Do не знайдено");
                    }
                })
                .catch((err) => setError(err.message));
        }
        if (!todoId){
            setCanEdit(true);
        }
    }, [todoId, user]);

    const handleNewItemKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newItemTitle.trim() !== "") {
            e.preventDefault();
            addNewItem();
        }
    };

    const addNewItem = () => {
        const newItem: todoItem = {
            title: newItemTitle.trim(),
            description: "",
            completed: false,
        };
        setItems([...items, newItem]);
        setNewItemTitle("");
    };

    const handleItemKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            saveEditedItem(index);
        }
    };

    const saveEditedItem = (index: number) => {
        if (editedItemTitle.trim() === "") return;
        const updatedItems = [...items];
        updatedItems[index].title = editedItemTitle.trim();
        setItems(updatedItems);
        setEditingIndex(null);
        setEditedItemTitle("");
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const toggleItemCompleted = (index: number, checked: boolean) => {
        const updatedItems = [...items];
        updatedItems[index].completed = checked;
        setItems(updatedItems);
    };

    const addViewer = () => {
        const email = newViewerEmail.trim().toLowerCase();
        if (!email) return;
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        try {
            if (todoId) {
                const docRef = doc(db, "todos", todoId);
                await updateDoc(docRef, {
                    title,
                    description,
                    completed,
                    items,
                    viewers,
                });
            } else {
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
                {todoId ? "Редагувати To-Do:" : "Створити нове To-Do"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                {/* Поля для заголовку та опису To-Do */}
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border-b"
                    readOnly={!canEdit}
                />
                <textarea
                    placeholder="Опис"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded"
                    readOnly={!canEdit}
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={(e) => setCompleted(e.target.checked)}
                    />
                    Виконано
                </label>

                {/* Секція для управління елементами To-Do */}
                <div className="border p-2 rounded">
                    <h2 className="font-semibold mb-2">Елементи To-Do</h2>
                    {items.length === 0 ? (
                        <p>Поки немає елементів.</p>
                    ) : (
                        <ul>
                            {items.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between border-b py-1"
                                >
                                    <div className="flex items-center flex-grow">
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={(e) =>
                                                toggleItemCompleted(index, e.target.checked)
                                            }
                                            className="mr-2"
                                        />
                                        {editingIndex === index ? (
                                            <input
                                                type="text"
                                                value={editedItemTitle}
                                                onChange={(e) => setEditedItemTitle(e.target.value)}
                                                onBlur={() => saveEditedItem(index)}
                                                onKeyDown={(e) => handleItemKeyDown(e, index)}
                                                className="p-1 border rounded flex-grow"
                                                autoFocus
                                                readOnly={!canEdit}
                                            />
                                        ) : (
                                            <div className="flex-grow flex items-center">

                                                <span
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        if (canEdit) {
                                                            setEditingIndex(index);
                                                            setEditedItemTitle(item.title);
                                                        }
                                                    }}
                                                >
                                                    {item.title}
                                                </span>
                                                {canEdit && (
                                                    <span
                                                        className="ml-2 cursor-pointer text-gray-500"
                                                        onClick={() => {
                                                            if (canEdit) {
                                                                setEditingIndex(index);
                                                                setEditedItemTitle(item.title);
                                                            }
                                                        }}
                                                    >
                                                        ✏️
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                removeItem(index)
                                            }
                                            }
                                            className="text-red-500 ml-2"
                                        >
                                            Видалити
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {/* Однорядковий інпут для додавання нового елемента */}
                    {canEdit && (
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Введіть назву елемента та натисніть Enter"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                                onKeyDown={handleNewItemKeyDown}
                                className="p-1 border rounded w-full"
                            />
                        </div>
                    )}

                </div>

                {/* Секція для управління Viewer користувачами */}
                <div className="border p-2 rounded mt-4">
                    <h2 className="font-semibold mb-2">Viewers</h2>
                    {viewers.length === 0 ? (
                        <p>Немає Viewers</p>
                    ) : (
                        <ul>
                            {viewers.map((email, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border-b py-1"
                                >
                                    <span>{email}</span>
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => removeViewer(index)}
                                            className="text-red-500"
                                        >
                                            Видалити
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {canEdit && (
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
                    )}
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
