const Notes = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-foreground mb-8">Notas</h1>
      <div className="bg-card p-6 rounded-lg shadow-card">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          Gestión de Notas
        </h2>
        <p className="text-muted-foreground">
          Aquí podrás crear, editar y organizar todas las notas relacionadas con los robots, estrategias de misiones y proyectos de innovación.
        </p>
        <div className="mt-8 border-t border-border pt-6 text-center text-muted-foreground">
          <p>Próximamente: ¡Un sistema completo para gestionar tus notas!</p>
        </div>
      </div>
    </div>
  );
};

export default Notes;