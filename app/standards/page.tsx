import { GlassHeader, SoftCard } from '@/components/ui';
import Footer from '@/components/ui/Footer';
import { CheckIcon } from '@/components/icons';
import { getMainStandards, getAdditionalStandards, getBiometricIndicators } from '@/lib/queries/standards';

export const metadata = {
  title: 'Standart Protokollar | FADAI',
  description: 'Beynəlxalq tibbi standartlara uyğunluq və biometrik göstəricilər',
};

export const revalidate = 3600;

export default async function StandardsPage() {
  const [standardProtocols, additionalStandards, biometricIndicators] = await Promise.all([
    getMainStandards(),
    getAdditionalStandards(),
    getBiometricIndicators(),
  ]);

  return (
    <>
      <GlassHeader />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-background-light">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-4">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-6">
                Standart Protokollar
              </h1>
              <p className="text-lg text-text-primary/60 tracking-tight max-w-xl mx-auto">
                Beynəlxalq tibbi standartlara uyğunluq və keyfiyyət təminatı
              </p>
            </div>
          </div>
        </section>

        {/* Main Standards Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-12 text-center">
              Beynəlxalq Standartlar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {standardProtocols.map((standard) => {
                const features = Array.isArray(standard.features) ? standard.features as string[] : [];
                return (
                  <SoftCard key={standard.id} className="p-8 flex flex-col">
                    {/* Icon & Acronym */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                        <span className="text-2xl">{standard.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold tracking-tight text-primary">
                          {standard.acronym}
                        </h3>
                      </div>
                    </div>

                    {/* Full Name */}
                    <p className="text-xs text-text-secondary tracking-tight mb-4 italic">
                      {standard.full_name}
                    </p>

                    {/* Title */}
                    <h4 className="text-lg font-semibold tracking-tight text-text-primary mb-2">
                      {standard.title}
                    </h4>

                    {/* Description */}
                    <p className="text-text-secondary tracking-tight leading-relaxed mb-6">
                      {standard.description}
                    </p>

                    {/* Features */}
                    {features.length > 0 && (
                      <ul className="space-y-2 mt-auto">
                        {features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-text-secondary tracking-tight flex items-start gap-2"
                          >
                            <CheckIcon />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SoftCard>
                );
              })}
            </div>

            {/* Additional Standards */}
            {additionalStandards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {additionalStandards.map((standard) => (
                  <SoftCard key={standard.id} className="p-8 flex items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-2xl">{standard.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold tracking-tight text-text-primary mb-2">
                        {standard.title}
                      </h4>
                      <p className="text-text-secondary tracking-tight leading-relaxed">
                        {standard.description}
                      </p>
                    </div>
                  </SoftCard>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Biometric Indicators Section */}
        {biometricIndicators.length > 0 && (
          <section className="py-20 bg-background-light">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-4">
                  Biometrik Göstəricilər
                </h2>
                <p className="text-text-secondary tracking-tight">
                  Fetal inkişafın qiymətləndirilməsi üçün əsas parametrlər
                </p>
              </div>

              {/* Biometric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {biometricIndicators.map((indicator) => (
                  <SoftCard key={indicator.id} className="p-6" hover={false}>
                    <div className="flex items-start">
                      {/* Acronym Badge */}
                      <div className="bg-primary text-white rounded-xl px-4 py-3 mr-4 flex-shrink-0">
                        <span className="text-lg font-semibold tracking-tight">
                          {indicator.acronym}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold tracking-tight text-text-primary mb-1">
                          {indicator.az_name}
                        </h4>
                        <p className="text-xs text-text-secondary italic mb-3">
                          {indicator.full_name}
                        </p>
                        <p className="text-sm text-text-secondary tracking-tight mb-3">
                          {indicator.description}
                        </p>

                        {/* Measurement Details */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-background rounded-lg p-3">
                            <p className="text-xs text-text-secondary mb-1">Normal Diapazon</p>
                            <p className="text-sm font-semibold text-primary tracking-tight">
                              {indicator.normal_range}
                            </p>
                          </div>
                          <div className="bg-background rounded-lg p-3">
                            <p className="text-xs text-text-secondary mb-1">Ölçü Metodu</p>
                            <p className="text-xs text-text-primary tracking-tight">
                              {indicator.measurement}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SoftCard>
                ))}
              </div>

              {/* Biometric Summary Table */}
              <SoftCard className="overflow-hidden" hover={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background-light">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary tracking-tight">
                          Göstərici
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary tracking-tight">
                          Azərbaycan
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary tracking-tight">
                          Normal Diapazon
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary tracking-tight">
                          Məqsəd
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {biometricIndicators.map((indicator) => (
                        <tr key={indicator.id} className="hover:bg-background transition-colors">
                          <td className="px-6 py-4">
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-semibold tracking-tight">
                              {indicator.acronym}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary tracking-tight">
                            {indicator.az_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary tracking-tight font-medium">
                            {indicator.normal_range}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary tracking-tight">
                            {indicator.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SoftCard>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
