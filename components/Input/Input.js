import classes from "./Input.module.css";
import { useRef, useState } from "react";
import Link from "next/link";
const Input = () => {
  const urlRef = useRef();
  const idRef = useRef();
  const [showNewUrl, setShowNewUrl] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [error, setError] = useState("");
  let hostName = "";
  if (typeof window !== "undefined") {
    hostName = window.location.hostname;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    const url = urlRef.current.value;
    const id = idRef.current.value.trim();

    try {
      const response = await fetch(`/api/url/${id}`, {
        method: "POST",
        body: JSON.stringify({ url, id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 401) {
        setError("Taken");
        throw new Error("URL ID IS ALREADY TAKEN");
      }
      setError("");
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      setNewUrl(id);
      setShowNewUrl(true);
      navigator.clipboard.writeText(`${hostName}/url/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={classes.box}>
      <form className={classes.formInput} onSubmit={submitHandler}>
        <div className={classes.label}>
          <label id="ogUrl">URL to shorten</label>
          <input id="ogUrl" ref={urlRef} className={classes.input}></input>
        </div>
        <div className={classes.label}>
          <label id="urlId">Custom Url Id</label>
          <input id="urlId" ref={idRef} className={classes.input}></input>
        </div>
        <button>Create URL</button>
        {showNewUrl && (
          <Link href={`/url/${newUrl}`}>{`${hostName}/url/${newUrl}`}</Link>
        )}
        {error && <span>URL ID IS ALREADY TAKEN CHOOSE ANOTHER ONE</span>}
      </form>
    </div>
  );
};

export default Input;
