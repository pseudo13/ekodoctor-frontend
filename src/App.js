import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useCallback, useEffect, useState } from "react";
import {
  getSickcases,
  updateSickcase,
  createSickcase,
} from "./service/sickcaseApi";
import { SickcasesList } from "./components/SickcasesList";
import "./App.css";
import { SickcaseEditable } from "./components/SickcaseEditable";
import { v4 as uuidv4 } from "uuid";
import * as axios from "axios";

function App() {
  const token =
    123 || document.querySelector('meta[name="csrf-token"]')[0].content;
  //axios.defaults.headers.common["X-CSRF-Token"] = token;
  const [sickcases, setSickcases] = useState([]);
  const [newMode, setNewMode] = useState(false);
  const [newSickcase, setNewSickcase] = useState({});

  useEffect(() => {
    // axios.defaults.headers.common["X-CSRF-Token"] = document
    //   .querySelector('meta[name="csrf-token"]')
    //   .getAttribute("content");
    if (!newMode) {
      getSickcasesHandler();
    }
  }, [newMode]);

  const getSickcasesHandler = useCallback(() => {
    getSickcases()
      .then((response) => {
        setSickcases(response.data ? response.data.reverse() : []);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const updateSickcaseHandler = ({ formData, sickcase }, callback) => {
    updateSickcase(formData, sickcase.id).then((response) => {
      setSickcases(
        sickcases?.map((sickcaseItem) => {
          const updatedData = response.data;
          if (sickcaseItem.id !== updatedData.id) {
            return sickcaseItem;
          } else {
            return updatedData;
          }
        })
      );
      if (callback) {
        callback();
      }
    });
  };

  const createSickcaseHandler = (formData) => {
    createSickcase(formData).then((response) => {
      toggle();
    });
  };

  const toggle = () => {
    console.log("toggle");
    setNewMode(false);
  };

  return (
    <>
      <header
        className="v-centered"
        style={{ position: "fixed", width: "100%", zIndex: 99 }}
      >
        <button
          className="button is-primary"
          onClick={() => setNewMode(!newMode)}
        >
          <span className="icon">
            <i className="fab fa-plus"></i>
          </span>
          <span>Share sickness with doctor</span>
        </button>
      </header>
      <section className="section">
        {newMode ? (
          <SickcaseEditable
            sickcase={newSickcase}
            submit={createSickcaseHandler}
            toggle={toggle}
          />
        ) : (
          <div className="container">
            <SickcasesList
              sickcases={sickcases}
              update={updateSickcaseHandler}
            />
          </div>
        )}
      </section>
    </>
  );
}

export default App;
