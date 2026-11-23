import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/UI/NavBar";
import Home from "./components/UI/Home";
import About from "./components/UI/About";
import Contact from "./components/UI/Contact";
import Blogs from "./components/Blogs/Blogs";
import CategoryPage from "./components/Blogs/CategoryPage";

import DsaCheatSheet from "./components/Blogs/DataStructures/DsaCheatSheet";
import Part1 from "./components/Blogs/ComputerNetworks/Part1";
import Part2 from "./components/Blogs/ComputerNetworks/Part2";
import Part3 from "./components/Blogs/ComputerNetworks/Part3";
import Part4 from "./components/Blogs/ComputerNetworks/Part4";
import Part5 from "./components/Blogs/ComputerNetworks/Part5";

// Just import new files here and put it in router in App function and then add in BlogsData.json

import "./App.css";
import React1 from "./components/Blogs/React/React1";
import SystemDesign1 from "./components/Blogs/SystemDesign/SystemDesign1";
import SystemDesign2_OOPS from "./components/Blogs/SystemDesign/SystemDesign2_OOPS";
import OOP1 from "./components/Blogs/ObjectOrientedProgramming/OOP1";
import SystemDesign3 from "./components/Blogs/SystemDesign/SystemDesign3";
import ScrollToTop from "./components/UI/ScrollToTop";
import SystemDesign4 from "./components/Blogs/SystemDesign/SystemDesign4";
import SystemDesign5 from "./components/Blogs/SystemDesign/SystemDesign5";

// Machine Learning
import TypesOfMachineLearning from "./components/Blogs/MachineLearning/01_Foundations/TypesOfMachineLearning";
import FeatureEngineeringFundamentals from "./components/Blogs/MachineLearning/02_FeatureEngineering/FeatureEngineeringFundamentals_02";
import FeatureTransformations from "./components/Blogs/MachineLearning/02_FeatureEngineering/FeatureTransformations_03";
import MissingDataImputation from "./components/Blogs/MachineLearning/02_FeatureEngineering/MissingDataImputation_04";
import OutlierDetection from "./components/Blogs/MachineLearning/02_FeatureEngineering/OutlierDetection_05";
import BatchAndStochasticAndMiniBatch from "./components/Blogs/MachineLearning/03_GradientDecent/BatchAndStochasticAndMiniBatch_06";
import LinearAndMultipleRegression from "./components/Blogs/MachineLearning/04_LinearRegression/LinearAndMultipleRegression_07";
import PolynomialRegressionAndTradeOffs from "./components/Blogs/MachineLearning/05_PolynomialRegression/PolynomialRegressionAndTradeOffs_08";
import OtherRegressions from "./components/Blogs/MachineLearning/05_PolynomialRegression/OtherRegressions_09";
import LogisticRegressionCore_10 from "./components/Blogs/MachineLearning/06_LogisticRegression/LogisticRegressionCore_10";
import ClassificationMetrics_11 from "./components/Blogs/MachineLearning/06_LogisticRegression/ClassificationMetrics_11";
import AdvancedLogisticRegression_12 from "./components/Blogs/MachineLearning/06_LogisticRegression/AdvancedLogisticRegression_12";
import BasicsAndBayesTheorem_13 from "./components/Blogs/MachineLearning/07_NaiveBayes/BasicsAndBayesTheorem_13";
import KNNAndSVM_14 from "./components/Blogs/MachineLearning/08_KNN_SVM/KNNAndSVM_14";
import SVMHardAndSoftMargins_15 from "./components/Blogs/MachineLearning/08_KNN_SVM/SVMHardAndSoftMargins_15";
import SVMKernels_16 from "./components/Blogs/MachineLearning/08_KNN_SVM/SVMKernels_16";
import DecisionTreeClassification_17 from "./components/Blogs/MachineLearning/09_DecisionTrees/DecisionTreeClassification_17";
import DecisionTreeRegression_18 from "./components/Blogs/MachineLearning/09_DecisionTrees/DecisionTreeRegression_18";
import EnsembleLearningBasics_19 from "./components/Blogs/MachineLearning/10_EnsembleLearning/EnsembleLearningBasics_19";
import BaggingConcepts_20 from "./components/Blogs/MachineLearning/10_EnsembleLearning/BaggingConcepts_20";
import RandomForests_21 from "./components/Blogs/MachineLearning/10_EnsembleLearning/RandomForests_21";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/blogs" element={<Blogs />} />

        <Route path="/category/:category" element={<CategoryPage />} />

        {/* Dsa */}
        <Route path="/blogs/dsa-cheatsheet" element={<DsaCheatSheet />} />

        {/* Machine Learning */}
        {/* Foundations */}
        <Route path="/blogs/ML-Foundations-1" element={<TypesOfMachineLearning />} />

        {/* Feature Engineering */}
        <Route path="/blogs/ML-FeatureEngineering-1" element={<FeatureEngineeringFundamentals />} />
        <Route path="/blogs/ML-FeatureEngineering-2" element={<FeatureTransformations />} />
        <Route path="/blogs/ML-FeatureEngineering-3" element={<MissingDataImputation />} />
        <Route path="/blogs/ML-FeatureEngineering-4" element={<OutlierDetection />} />

        {/* Gradient Descent */}
        <Route path="/blogs/ML-GradientDescent-1" element={<BatchAndStochasticAndMiniBatch />} />

        {/* Linear Regression */}
        <Route path="/blogs/ML-LinearAndMultipleRegression-1" element={<LinearAndMultipleRegression />} />

        {/* Polynomial Regression */}
        <Route path="/blogs/ML-PolynomialRegression-1" element={<PolynomialRegressionAndTradeOffs />} />

        {/* Regularization */}
        <Route path="/blogs/ML-Regularization-1" element={<OtherRegressions />} />

        {/* Logistic Regresion  */}
        <Route path="/blogs/ML-LogisticRegression-1" element={<LogisticRegressionCore_10 />} />
        <Route path="/blogs/ML-ClassificationMetrics-1" element={<ClassificationMetrics_11 />} />
        <Route path="/blogs/ML-AdvancedLogisticRegression-1" element={<AdvancedLogisticRegression_12 />} />

        {/* Naive Bayes Theorem  */}
        <Route path="/blogs/ML-NaiveBayes-1" element={<BasicsAndBayesTheorem_13 />} />

        {/* KNN and SVN  */}
        <Route path="/blogs/ML-KNN-SVM-1" element={<KNNAndSVM_14 />} />
        <Route path="/blogs/ML-SVM-Margins-1" element={<SVMHardAndSoftMargins_15 />} />
        <Route path="/blogs/ML-SVM-Kernels-1" element={<SVMKernels_16 />} />

        {/* Decision Trees  */}
        <Route path="/blogs/ML-DecisionTree-Classification-1" element={<DecisionTreeClassification_17 />} />
        <Route path="/blogs/ML-DecisionTree-Regression-1" element={<DecisionTreeRegression_18 />} />

        {/* Ensemble Learning  */}
        <Route path="/blogs/ML-EnsembleLearning-1" element={<EnsembleLearningBasics_19 />} />
        <Route path="/blogs/ML-Bagging-1" element={<BaggingConcepts_20 />} />
        <Route path="/blogs/ML-RandomForest-1" element={<RandomForests_21 />} />

        {/* Computer Networks */}
        <Route path="/blogs/CN-part-1" element={<Part1 />} />
        <Route path="/blogs/CN-part-2" element={<Part2 />} />
        <Route path="/blogs/CN-part-3" element={<Part3 />} />
        <Route path="/blogs/CN-part-4" element={<Part4 />} />
        <Route path="/blogs/CN-part-5" element={<Part5 />} />

        {/* React */}
        <Route path="/blogs/React" element={<React1 />} />

        {/* OOPs */}
        <Route path="/blogs/OOPS" element={<OOP1 />} />

        {/* System Design */}
        <Route path="/blogs/SystemDesign-part-1" element={<SystemDesign1 />} />
        <Route
          path="/blogs/SystemDesign-part-2-OOPS"
          element={<SystemDesign2_OOPS />}
        />
        <Route path="/blogs/SystemDesign-part-3" element={<SystemDesign3 />} />
        <Route path="/blogs/SystemDesign-part-4" element={<SystemDesign4 />} />
        <Route path="/blogs/SystemDesign-part-5" element={<SystemDesign5 />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>

        <p className="mt-4 text-xl text-gray-600">Page Not Found</p>

        <a
          href="/"
          className="inline-block mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;