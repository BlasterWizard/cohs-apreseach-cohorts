import { getDoc, doc } from "firebase/firestore";
import db from "./firebase";
import { SelectOption } from "./Interfaces+Classes";

export async function getAvailableGraduatingYears() {
    let options: SelectOption[] = [];
    const availableGraduatingYearsSnap = await getDoc(
      doc(db, "settings", "availableGraduatingYears")
    );
    if (availableGraduatingYearsSnap.exists()) {
      availableGraduatingYearsSnap.data().years.forEach((year: string) => {
        options.push({ value: year, label: year });
      });
    } else {
      console.log("Can't Find Doc");
    }
    return options;
  }