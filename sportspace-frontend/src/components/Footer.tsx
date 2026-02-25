const Footer = () => {
  const getYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div>
      <footer className="bg-light text-center py-3">
        <span>{getYear()}</span>
      </footer>
    </div>
  );
};

export default Footer;
