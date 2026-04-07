import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-eyebrow">Bienvenido al</p>
        <h1>Ministerio Nacional de Matrimonios y Familias</h1>
        <p className="hero-subtitle">
          Transformando vidas, fortaleciendo familias y construyendo comunidad<br />
          a través de la fe, el amor y el servicio. 
        </p>
        <div className="hero-btns">
          <Link href="/como-ser-parte" className="btn btn-primary">Únete a nosotros</Link>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <span>Desplázate</span>
        <i className="fas fa-chevron-down"></i>
      </div>
    </section>
  );
}
