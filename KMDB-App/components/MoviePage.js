export default function MoviePage({ params }) {
    return () => (
      <div>
        <h1>Информация о фильме</h1>
        <p>ID фильма: {params.id}</p>
      </div>
    );
  }
  