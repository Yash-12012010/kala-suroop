
import React from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DynamicContentProps {
  pageSlug: string;
  sectionKey: string;
  renderAs?: 'hero' | 'card' | 'text' | 'custom';
  fallback?: React.ReactNode;
  className?: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  pageSlug, 
  sectionKey, 
  renderAs = 'custom', 
  fallback = null,
  className = ""
}) => {
  const { getContentBySection, loading } = usePageContent(pageSlug, sectionKey);
  
  const content = getContentBySection(sectionKey);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-20 rounded"></div>;
  }

  if (!content) {
    return <>{fallback}</>;
  }

  const renderContent = () => {
    switch (renderAs) {
      case 'hero':
        return (
          <section 
            className={`py-16 px-4 text-center ${className}`}
            style={{ backgroundColor: content.background_color }}
          >
            <div className="max-w-4xl mx-auto">
              {content.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {content.title}
                </h1>
              )}
              {content.subtitle && (
                <h2 className="text-xl md:text-2xl mb-4 text-gray-600">
                  {content.subtitle}
                </h2>
              )}
              {content.description && (
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                  {content.description}
                </p>
              )}
              {content.image_url && (
                <img 
                  src={content.image_url} 
                  alt={content.title || 'Hero image'}
                  className="w-full max-w-2xl mx-auto mb-8 rounded-lg shadow-lg"
                />
              )}
              {content.button_text && content.button_link && (
                <Button size="lg" asChild>
                  <a href={content.button_link}>{content.button_text}</a>
                </Button>
              )}
            </div>
          </section>
        );

      case 'card':
        return (
          <Card className={`${content.is_featured ? 'border-2 border-primary' : ''} ${className}`}>
            {content.image_url && (
              <img 
                src={content.image_url} 
                alt={content.title || 'Card image'}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader>
              {content.title && <CardTitle>{content.title}</CardTitle>}
            </CardHeader>
            <CardContent>
              {content.description && <p>{content.description}</p>}
              {content.link_url && (
                <Button className="mt-4" asChild>
                  <a href={content.link_url}>Learn More</a>
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 'text':
        return (
          <div className={className}>
            {content.title && <h3 className="text-xl font-semibold mb-2">{content.title}</h3>}
            {content.content && <p>{content.content}</p>}
          </div>
        );

      default:
        // Custom rendering - render all content fields
        return (
          <div className={className}>
            {Object.entries(content).map(([key, value]) => {
              if (typeof value === 'string' && value.startsWith('http') && (value.includes('.jpg') || value.includes('.png') || value.includes('.webp'))) {
                return <img key={key} src={value} alt={key} className="max-w-full h-auto rounded" />;
              }
              if (typeof value === 'boolean') {
                return value ? <div key={key} className="text-green-600">✓ {key}</div> : null;
              }
              if (typeof value === 'string') {
                return <div key={key} className="mb-2">{value}</div>;
              }
              return null;
            })}
          </div>
        );
    }
  };

  return renderContent();
};

export default DynamicContent;
