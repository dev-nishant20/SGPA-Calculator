const express = require("express");
const app = express();
const path = require("path");
let port = 8080;

app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.set("view engine","ejs");
app.set("views" , path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname, "public")));

const subjectCredits = {
    "Chemistry": 4,
    "Mathematics-2": 4,
    "Electronics": 3,
    "Mechanical": 3,
    "EVS": 3,
    "chemLab": 1,
    "ElecLab": 1,
    "engLangLab": 1,
    "WokshopMech": 2,
    "Physics": 4,
    "Mathematics-1": 4,
    "FEE": 3,
    "PPS": 3,
    "SoftSkills": 3,
    "PhyLab": 1,
    "FeeLab": 1,
    "PpsLab": 1,
    "ED": 2,
};

const gradePoints = {
    "A+": 10,
    "A": 9,
    "B+": 8,
    "B": 7,
    "C": 6,
    "D": 5,
    "F": 0
};

app.get("/subject", (req,res) => {
    let { subjects } = req.query;
    if(subjects>=1){
        res.render("detail.ejs",{ subjects });
    }
});

app.post("/cal" , (req,res) => {
    try{
        const sub = req.body;
        console.log(sub);
        let sumCred = 0;
        let sumCpGp = 0;

        // Ensure subject and grade are arrays (handle single subject case)
        const subjectArray = Array.isArray(sub.subject) ? sub.subject : [sub.subject];
        const gradeArray = Array.isArray(sub.grade) ? sub.grade : [sub.grade];

        for(let i = 0;i < sub.subject.length;i++){
            const subjectName = subjectArray[i];
            const grade = gradeArray[i];

            // Check subject
            if(!subjectCredits[subjectName]){
                continue;
            }

            // Check grade
            if (gradePoints[grade] === undefined) {
                continue;
            }

            const credit = subjectCredits[subjectName];
            const gradePoint = gradePoints[grade];
            
            sumCred += credit;
            sumCpGp += credit * gradePoint;
        }

        // Calculate SGPA
        let sgpa = sumCpGp / sumCred;

        console.log("Sum of credits:", sumCred);
        console.log("Sum of CP * GP:", sumCpGp);
        console.log("Your SGPA is:", sgpa.toFixed(2));


        res.render("res.ejs", { sgpa });
    }
    catch (err) {
        console.error("Error calculating SGPA:", err);
        res.render("error.ejs");
    }

});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});