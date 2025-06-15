
import React from 'react';

interface DynamicContentProps {
  pageSlug: string;
  sectionKey: string;
  renderAs?: 'text' | 'hero' | 'card' | 'list' | 'custom';
  className?: string;
  fallback?: React.ReactNode;
  content?: any;
}

const DynamicContent: React.FC<DynamicContentProps> = ({
  pageSlug,
  sectionKey,
  renderAs = 'custom',
  className = '',
  fallback = null,
  content
}) => {
  if (!content) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  const renderContent = () => {
    switch (renderAs) {
      case 'text':
        return typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div>
            {content.title && <h2 className="text-3xl font-bold mb-4">{content.title}</h2>}
            {content.subtitle && <p className="text-lg text-gray-600 dark:text-gray-300">{content.subtitle}</p>}
            {content.description && <p>{content.description}</p>}
          </div>
        );

      case 'hero':
        return (
          <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {content.title || 'Welcome'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                {content.subtitle || content.description || 'Welcome to our platform'}
              </p>
              {content.buttonText && (
                <button className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold">
                  {content.buttonText}
                </button>
              )}
            </div>
          </section>
        );

      case 'card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {content.title && <h3 className="text-xl font-semibold mb-2">{content.title}</h3>}
            {content.description && <p className="text-gray-600 dark:text-gray-300">{content.description}</p>}
            {content.image && <img src={content.image} alt={content.title} className="w-full h-48 object-cover rounded mt-4" />}
          </div>
        );

      case 'list':
        return (
          <div>
            {content.title && <h3 className="text-xl font-semibold mb-4">{content.title}</h3>}
            {content.items && (
              <ul className="space-y-2">
                {content.items.map((item: any, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {typeof item === 'string' ? item : item.text || item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        if (content.stats && Array.isArray(content.stats)) {
          return (
            <section className="py-16 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-orange-950/20 dark:via-pink-950/20 dark:to-purple-950/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {content.stats.map((stat: any, index: number) => (
                    <div key={index} className="p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${getGradientColor(stat.color)} bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }
        
        return typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div>{JSON.stringify(content)}</div>
        );
    }
  };

  const getGradientColor = (color: string) => {
    switch (color) {
      case 'orange': return 'from-orange-600 to-pink-600';
      case 'pink': return 'from-pink-600 to-purple-600';
      case 'purple': return 'from-purple-600 to-indigo-600';
      case 'blue': return 'from-indigo-600 to-blue-600';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  return <div className={className}>{renderContent()}</div>;
};

export default DynamicContent;
