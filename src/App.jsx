import { useState } from "react";
import "./App.css";
import { login, request } from "./hooks/requests";
import { useEffect } from "react";
import { useCallback } from "react";

function App() {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [statusMesssage, setStatusMessage] = useState("Yuklanmoqda...");
    const [userData, setUserData] = useState(null);

    const loadProfile = useCallback(() => {
        setStatusMessage("Yuklanmoqda...");
        request("/api/profile/")
            .then(async (request) => {
                const data = await request.json();
                setUserData(data);
                setStatusMessage("Login qilingan");
            })
            .catch(() => {
                setStatusMessage("Login amalga oshirilinmagan");
            });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();

        setStatusMessage("Login qilinmoqda...");
        login(usernameInput, passwordInput)
            .then(() => {
                setStatusMessage("Login amalga oshirildi");

                setTimeout(loadProfile, 500);
            })
            .catch(() => {
                setStatusMessage("Loginda xatolik mavjud");
            });
    };

    useEffect(() => {
        setTimeout(loadProfile, 100);
    }, [loadProfile]);

    return (
        <>
            <p>{statusMesssage}</p>

            <section>
                <form action="" method="post" onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Login</button>
                </form>
            </section>

            {userData && (
                <section>
                    <p>Ism: {userData.first_name}</p>
                    <p>Username: {userData.username}</p>
                </section>
            )}
        </>
    );
}

export default App;
