import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Leaf, 
  Shield,
  BookOpen,
  Download
} from "lucide-react";

interface DiagnosisResultProps {
  result: {
    disease: string;
    confidence: number;
    severity: string;
    treatment: string;
    prevention: string;
    symptoms: string[];
    organicTreatment?: string;
    timeToRecover?: string;
  } | null;
  onSaveToDiary: () => void;
  onNewDiagnosis: () => void;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  result,
  onSaveToDiary,
  onNewDiagnosis
}) => {
  if (!result) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>Diagnosis Complete</span>
            </CardTitle>
            <Badge className={`px-3 py-1 ${getSeverityColor(result.severity)}`}>
              {result.severity} Severity
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Disease Identification */}
          <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{result.disease}</h3>
              <div className="text-right">
                <div className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}%
                </div>
                <div className="text-sm text-gray-500">Confidence</div>
              </div>
            </div>
            
            {result.symptoms && result.symptoms.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Identified Symptoms:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Treatment Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center text-red-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Immediate Treatment
              </h4>
              <p className="text-sm text-red-700 leading-relaxed">{result.treatment}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center text-green-800">
                <Shield className="h-5 w-5 mr-2" />
                Prevention Tips
              </h4>
              <p className="text-sm text-green-700 leading-relaxed">{result.prevention}</p>
            </div>
          </div>

          {/* Organic Treatment (if available) */}
          {result.organicTreatment && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center text-blue-800">
                <Leaf className="h-5 w-5 mr-2" />
                Organic Treatment Option
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">{result.organicTreatment}</p>
            </div>
          )}

          {/* Recovery Timeline */}
          {result.timeToRecover && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center text-purple-800">
                <Clock className="h-5 w-5 mr-2" />
                Expected Recovery Time
              </h4>
              <p className="text-sm text-purple-700">{result.timeToRecover}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button 
              onClick={onSaveToDiary}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Save to Farm Diary
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onNewDiagnosis}
              className="flex-1"
            >
              New Diagnosis
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Monitor your crops daily and apply treatments as recommended. 
              For severe cases, consult with local agricultural experts.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DiagnosisResult;