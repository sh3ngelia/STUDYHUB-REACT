```markdown
# StudyHub

სასწავლო პროგრესის მართვის პლატფორმა, რომელიც მომხმარებელს საშუალებას აძლევს შექმნას საგნები, თვალყური ადევნოს პროგრესს და დაგეგმოს სასწავლო განრიგი.

## ფუნქციონალი

- JWT-ზე დაფუძნებული ავთენტიფიკაცია (რეგისტრაცია, შესვლა, პაროლის შეცვლა)
- საგნების შექმნა, რედაქტირება და წაშლა
- პროგრესის ვიზუალური თვალყურისდევნება (0–100%)
- საგნების სორტირება სახელით, პროგრესით და თარიღით
- კალენდარი სასწავლო მოვლენების დაგეგმვისთვის
- მომხმარებლის პროფილი avatar-ის ავტომატური ფერგენერაციით
- Dark / Light თემა
- სრულად რესპონსიული დიზაინი

## ტექნოლოგიები

**Frontend**
- React 18 + Vite
- Redux Toolkit - გლობალური state მართვა
- React Router v6 - კლიენტის მხარის მარშრუტიზაცია
- Framer Motion - ანიმაციები
- React Hook Form - ფორმების ვალიდაცია
- Lucide React - იკონები

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT) - ავთენტიფიკაცია
- bcrypt - პაროლის ჰეშირება

**Deploy**
- Frontend: Vercel
- Backend: Render

## გაშვება ლოკალზე

**წინაპირობები:** Node.js 18+, MongoDB

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
