"use client"
import {useEffect, useState} from "react";
import {createWorker} from "tesseract.js";

export default function AnalyzeContent() {
    const [raw, setRaw] = useState("");

    const [allergy, setAllergy] = useState("");
    const [allergyList, setAllergyList] = useState("");
    const [showAllergy, setShowAllergy] = useState(false);

    const [ingredientsLink, setIngredientsLink] = useState("")

    const [allergiesIdentified, setAllergiesIdentified] = useState("");
    const [showRes, setShowRes] = useState(false);

    // Tesseract.js connection
    const analyzeIngredients = async() => {
        const worker = await createWorker('eng');
        const ret = await worker.recognize(ingredientsLink);
        console.log(ret.data.text);
        await worker.terminate();
        setRaw(ret.data.text.toLowerCase());
    };

    // Appends new allergy to list
    function addAllergyToList() {
        const newAllergyList = (allergyList.length==0)
            ? allergyList.concat(allergy) : allergyList.concat(', ', allergy);
        setAllergyList(newAllergyList);
    }

    // Compares the user's allergy list with the ingredients list.
    function checkForAllergies() {
        const allergiesSplit = allergyList.split(', ');
        let found = "";

        for (let i = 0; i < allergiesSplit.length; i++) {
            if (raw.match(allergiesSplit[i])) {
                found += allergiesSplit[i] + ", ";
                setAllergiesIdentified(found);
            }
        }
    }

    useEffect(()=> {
        analyzeIngredients();
    },[]);

    return (
        <div className="bg-gradient-to-t from-stone-100 to-stone-300 w-full p-6 rounded-xsborder-2 my-5">
            <div className="text-green-950 text-4xl font-bold tracking-normal">
                <h1 className="">
                    Is your food safe to consume?
                </h1>
            </div>

            {/*------------------------------User Input Allergies & Ingredients List------------------------------*/}
            <div className="flex flex-col items-center justify-center p-6">
                <form onSubmit={event => {
                    event.preventDefault();
                    addAllergyToList();
                    setShowAllergy(true);
                }}>
                    <label className="text-xl font-semibold text-green-950">
                        Enter an allergy:
                    </label>
                    <input placeholder="Ex: nuts"
                    className="w-20 bg-lime-800 hover:bg-stone-200 text-stone-200
                     hover:text-stone-600 border-stone-500 border-1 rounded-md py-1 px-2 my-5 mx-2"
                    required={true} value={allergy}
                    onChange={event => {
                        event.preventDefault();
                        setAllergy(event.target.value);
                    }}/>
                    <button className="justify-center w-10 text-3xl text-stone-500"
                    type="submit"> + </button>
               </form>
            </div>
            {/*--------Display when user give allergen(s)--------*/}
            {showAllergy && (
                <div>
                    <p className="text-stone-500"> {allergyList}</p>
                    <button className="w-30 text-stone-500 bg-stone-300 my-2"
                        onClick={()=>{
                            setShowAllergy(false);
                            setShowRes(false);
                            setAllergyList("");
                            }}>
                        Clear</button>
                </div>
            )}

            {/*------------------------------Check For Allergies------------------------------*/}

            <div className="flex flex-col items-center justify-center p-6">
                <form className="flex flex-col items-center w-1/2 bg-lime-800 text-stone-200 border-stone-500
                 border-1 rounded-md py-2 px-2 m-1" onSubmit={
                    async (event) => {
                        event.preventDefault();
                        await analyzeIngredients();
                        checkForAllergies();
                        setShowRes(true);
                    }}>
                    {/*--------User provides a link to an image that displays the ingredients list--------*/}
                    <label className="text-center font-bold tracking-normal text-stone-200">
                        Upload a link to a nutrition label for checking!
                    </label>
                    <input className="w-75 text-center bg-stone-500 hover:bg-stone-400 rounded-xs m-2
                     text-stone-200 py-2 px-2" type="text" placeholder="https://some-ingredients-list..."
                        onChange={event =>
                            setIngredientsLink(event.target.value)}/>
                    <button className="w-30 text-center bg-stone-500 hover:bg-stone-400 rounded-xs m-2
                     text-stone-200 ">
                        Submit
                    </button>
                </form>
            </div>

            {/*------------------------------Results------------------------------*/}

            {showRes && (
                <div className="flex flex-col items-center justify-center p-6">
                    <div className="flex flex-col items-center w-1/2 bg-lime-800 border-stone-500
                 border-1 rounded-md py-2 px-2 m-1">
                        {/*--------Display when ALLERGENS found--------*/}
                        {allergiesIdentified && (
                            <div className="flex flex-col items-center justify-center p-6">
                                <h1 className="text-green-950 text-2xl font-bold tracking-normal">
                                    Allergens Identified! </h1>
                                <p className="text-stone-200">Contains: {allergiesIdentified}</p>
                            </div>
                        )}
                        {/*--------Display when NO ALLERGENS found--------*/}
                        {!allergiesIdentified && (
                            <div className="flex flex-col items-center justify-center p-6">
                                <h1 className="text-green-950 text-2xl font-bold tracking-normal">
                                    No Allergens Identified! </h1>
                            </div>
                        )}
                        {/*--------Restart--------*/}
                        <button className="w-30 bg-stone-500 hover:bg-stone-400 rounded-xs m-2"
                                onClick={()=>{
                                    window.location.reload();
                                    setAllergiesIdentified("");
                                    setAllergyList("");
                                    setShowAllergy(false);
                                }}> Restart</button>
                    </div>
                </div>
            )}
        </div>
    );
}