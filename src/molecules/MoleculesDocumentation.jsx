export default function MoleculesDocumentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 text-slate-700 leading-relaxed">

      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Molecules – תיעוד מערכת
        </h1>
        <p className="text-slate-500">
          שכבת המולקולות היא הליבה הכימית של עולם המשחק. כל תהליך מתקדם מתחיל כאן.
        </p>
      </section>

      {/* What is a Molecule */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          מהי מולקולה בעולם המשחק?
        </h2>
        <p>
          מולקולה היא יחידת החומר הפעיל הבסיסית ביותר בעולם הכימי של המשחק.
          כל תהליך מתקדם – מיצוי, הפרדה, סינתזה ותגובה – מתבצע על מולקולות,
          ולא על חומרי גלם גולמיים.
        </p>
        <p className="mt-2">
          המולקולה אינה פטרייה, אינה עשב ואינה קריסטל –  
          אלא החומר הפעיל שמסתתר בתוכם.
        </p>
      </section>

      {/* Relation to Ingredients */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          הקשר בין Molecules ל־Ingredients
        </h2>
        <p>
          Ingredients (כגון פטריות, עשבים, מינרלים ומלחים) הם מקורות טבעיים,
          אך הם אינם חומרים טהורים.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Ingredient אחד יכול להכיל מולקולה אחת או יותר</li>
          <li>הריכוזים אינם קבועים</li>
          <li>ייתכנו חומרים פעילים נסתרים</li>
        </ul>
        <p className="mt-2">
          מטרת השחקן היא לבודד ולהפריד את המולקולות מתוך ה־Ingredients
          בעזרת ממסים, חימום ותהליכי הפרדה.
        </p>
      </section>

      {/* Basic Fields */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          שדות בסיסיים של מולקולה
        </h2>

        <div className="space-y-3">
          <p>
            <strong>שם במשחק (In-Game Name):</strong>  
            השם שבו המולקולה מוכרת בעולם המשחק. משמש ללור ולחוויה.
          </p>

          <p>
            <strong>שם כימי אמיתי (Actual Molecule Name):</strong>  
            השם המדעי של המולקולה, המבוסס על כימיה אמיתית.
            משמש כעוגן למציאות ולהשראה.
          </p>

          <p>
            <strong>תיאור (Description):</strong>  
            תיאור חופשי של אופי המולקולה, שימושים, סיכונים ורמזים לשחקן.
          </p>
        </div>
      </section>

      {/* Natural Families */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          מקורות טבעיים (Natural Families)
        </h2>
        <p>
          כל מולקולה יכולה להופיע ביותר ממשפחה אחת. משפחות מייצגות
          מקורות אפשריים למציאה, ולא הבטחה לזמינות.
        </p>
        <p className="mt-2">
          דוגמאות למשפחות:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>פטריות</li>
          <li>שורשים</li>
          <li>צמחים זוחלים</li>
          <li>מינרלים</li>
          <li>קריסטלים ומלחים</li>
        </ul>
      </section>

      {/* Physical Properties */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          תכונות פיזיקליות (להפרדה וזיקוק)
        </h2>

        <p>
          <strong>מסה מולרית:</strong>  
          משמשת להבחנה בין מולקולות, לאיזון משחקי ולתהליכי הפרדה.
        </p>

        <p className="mt-2">
          <strong>נקודת התכה:</strong>  
          הטמפרטורה שבה המולקולה משנה מצב צבירה. משפיעה על יציבות וסיכון.
        </p>

        <p className="mt-2">
          <strong>נקודת רתיחה:</strong>  
          מאפשרת זיקוק והפרדה בין מספר מולקולות על בסיס טמפרטורה.
        </p>
      </section>

      {/* Solubility */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          מסיסות (Solubility Traits)
        </h2>
        <p>
          המולקולה אינה “יודעת” באיזה ממס היא תתמוסס – היא יודעת מי היא.
        </p>

        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>התאמה לפולריות:</strong> נטייה לסביבה פולרית או אפולרית</li>
          <li><strong>יכולת קשרי מימן:</strong> משפיעה על אינטראקציה עם ממסים פרוטיים</li>
          <li><strong>יונית / נייטרלית:</strong> משפיעה בצורה חזקה על מסיסות ויציבות</li>
        </ul>
      </section>

      {/* Stability & Reactivity */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          יציבות ותגובתיות
        </h2>

        <p>
          <strong>יציבות (Stability):</strong>  
          קובעת עד כמה המולקולה רגישה לחום, זמן ותנאים קיצוניים.
        </p>

        <p className="mt-2">
          <strong>תגובתיות (Reactivity):</strong>  
          מייצגת את הקלות שבה ניתן לגרום למולקולה להיכנס לתגובה כימית.
          מולקולות תגובתיות הן חזקות אך מסוכנות יותר.
        </p>
      </section>

      {/* Yield */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          ריכוז ותפוקה (Extraction Yield)
        </h2>
        <p>
          מולקולות אינן מופיעות בכמות אחידה.
          לכל מולקולה טווח ריכוז אופייני, וסיכוי לכישלון במיצוי.
        </p>
        <p className="mt-2">
          מערכת זו יוצרת ניסוי וטעייה, הפתעות וחומרים נדירים באמת.
        </p>
      </section>

      {/* Rarity */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          נדירות וגילוי
        </h2>
        <p>
          מולקולות יכולות להיות נפוצות, נדירות או אגדיות.
          חלקן אינן ידועות לשחקן בתחילת המשחק ונחשפות רק דרך ניסוי ומחקר.
        </p>
      </section>

      {/* Visual */}
      <section>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          ייצוג חזותי
        </h2>
        <p>
          לכל מולקולה ניתן לצרף איור או תמונה סכמטית.
          הייצוג החזותי מסייע לזיהוי, חיבור רגשי והבנת החומר.
        </p>
      </section>

      {/* Summary */}
      <section className="border-t pt-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          סיכום
        </h2>
        <p>
          מולקולות הן הלב של המערכת הכימית.
          כל החלטה – בחירת ממס, חימום, הפרדה או תגובה –
          מתחילה בהבנת המולקולה.
        </p>
      </section>

    </div>
  );
}
