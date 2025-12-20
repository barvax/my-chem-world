export default function IngredientFamiliesDocs() {
  return (
    <div className="max-w-3xl space-y-4 text-slate-700">
      <h2 className="text-lg font-semibold">מהי משפחת רכיבים?</h2>

      <p>
        משפחת רכיבים היא קטגוריה כללית המתארת מקור של חומרים במשחק,
        כגון פטריות, שורשים, מינרלים או רכיבים מן החי.
      </p>

      <p>
        כל רכיב במשחק חייב להשתייך למשפחה קיימת אחת בלבד.
        לא ניתן ליצור רכיב ללא שיוך למשפחה.
      </p>

      <h3 className="font-semibold">למה זה חשוב?</h3>

      <ul className="list-disc pl-5 space-y-1">
        <li>יוצר היררכיה ברורה בעולם המשחק</li>
        <li>מאפשר חוקים שונים לפי סוג מקור</li>
        <li>מקל על סינון, חיפוש ואיזון</li>
      </ul>

      <p className="text-sm text-slate-500">
        בהמשך, משפחות ישמשו גם לחוקים פיזיקליים, ביולוגיים
        והתנהגותיים בתוך ה־Sandbox.
      </p>
    </div>
  );
}
