import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

// Constants
import { colors } from '../constants/colors';
import { supabase } from '../lib/supabase';

// --- Admin Upload Screen ---
const AdminUploadScreen = ({ navigation }) => {
    const [selectedDocument, setSelectedDocument] = useState(null); // Holds the selected document info
    const [isUploading, setIsUploading] = useState(false); // Tracks upload state
    const [uploadMessage, setUploadMessage] = useState(''); // Feedback message
    const [uploadedUrl, setUploadedUrl] = useState('');

    // Function to open the document picker
    const pickDocument = async () => {
        // Reset state before picking
        setSelectedDocument(null);
        setUploadMessage('');
        setUploadedUrl('');
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Only allow PDF files
                copyToCacheDirectory: true, // Recommended for accessing the file URI
            });

            console.log('Document Picker Result:', JSON.stringify(result, null, 2)); // Log the full result

            // Handle the result based on the new API structure
            if (result.canceled === false && result.assets && result.assets.length > 0) {
                console.log('Selected Asset:', JSON.stringify(result.assets[0], null, 2));
                setSelectedDocument(result.assets[0]); // Get the first selected asset
            } else if (result.canceled === true) {
                setUploadMessage('Document selection cancelled.');
            } else {
                setUploadMessage('Failed to select document or no assets found.');
            }
        } catch (err) {
            console.error('Error picking document:', err);
            setUploadMessage(`Error picking document: ${err.message || 'Unknown error'}`);
        }
    };

    // Function to simulate the upload process
    const handleUpload = async () => {
        if (!selectedDocument) {
            setUploadMessage('Please select a valid PDF document first.');
            return;
        }
        setIsUploading(true);
        setUploadMessage('Uploading...');
        setUploadedUrl('');

        try {
            // **Log the URI being used**
            console.log(`Attempting to upload file from URI: ${selectedDocument.uri}`);
            console.log(`File Name: ${selectedDocument.name}`);
            console.log(`MIME Type: ${selectedDocument.mimeType}`);

            const fileExt = selectedDocument.name?.split('.').pop() || 'pdf';
            const fileName = `${Date.now()}_${selectedDocument.name?.replace(/[^a-zA-Z0-9.]/g, '_') || 'invoice'}.${fileExt}`;
            const filePath = `${fileName}`;

            // Prepare FormData for upload
            const formData = new FormData();
            formData.append('file', {
                uri: selectedDocument.uri,
                name: fileName, // Use the sanitized name for upload
                type: selectedDocument.mimeType || 'application/pdf',
            });

            console.log('Uploading to bucket: pdf, path:', filePath);

            // Upload the file
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('pdf') // Your bucket name
                .upload(filePath, formData, {
                    upsert: false,
                });

            // **Check specifically for upload error**
            if (uploadError) {
                console.error('Supabase Upload Error:', uploadError);
                // Log the detailed error object
                console.error('Detailed Upload Error:', JSON.stringify(uploadError, null, 2));
                // Check for specific error messages
                if (uploadError.message.includes('fetch')) {
                     Alert.alert('Upload Failed', `Network error during upload: ${uploadError.message}. Please check your connection and Supabase URL/keys.`);
                } else if (uploadError.message.includes('mime type')) {
                     Alert.alert('Upload Failed', `Invalid file type: ${uploadError.message}. Please select a valid PDF.`);
                } else if (uploadError.message.includes('policy')) {
                     Alert.alert('Upload Failed', `Permission denied: ${uploadError.message}. Check Supabase storage policies (RLS).`);
                }
                 else {
                    Alert.alert('Upload Failed', uploadError.message || 'An unexpected error occurred during upload.');
                }
                // Set the message state as well
                setUploadMessage(`Upload Failed: ${uploadError.message}`);
                setIsUploading(false); // Stop loading on error
                return; // Stop execution here
            }

            console.log('Supabase Upload Success Data:', uploadData);

            // Get the public URL
            const { data: urlData, error: urlError } = supabase.storage
                .from('pdf')
                .getPublicUrl(filePath);

             // **Check specifically for URL error**
             if (urlError || !urlData || !urlData.publicUrl) {
                 console.error('Get Public URL Error:', urlError);
                 console.warn('Could not get public URL. Check bucket permissions in Supabase.');
                 setUploadMessage('File uploaded, but could not retrieve public URL. Check bucket permissions.');
                 // Still consider the upload successful but warn about the URL
                 setIsUploading(false);
                 return; // Stop if URL fails
             }


            const publicUrl = urlData.publicUrl;
            console.log('Public URL:', publicUrl);
            setUploadedUrl(publicUrl);
            setUploadMessage(`Upload complete!\nPublic URL: ${publicUrl}`);

        } catch (error) {
            // Catch any other unexpected errors during the process
            console.error('Upload Process Catch Error:', error);
            // Check if it's a network error caught outside the Supabase call
             if (error.message && error.message.toLowerCase().includes('network request failed')) {
                 setUploadMessage('Upload Failed: Network request failed. Please check your internet connection.');
                 Alert.alert('Upload Failed', 'Network request failed. Please check your internet connection.');
             } else {
                 setUploadMessage(`Upload Failed: ${error.message || 'An unexpected error occurred.'}`);
                 Alert.alert('Upload Failed', error.message || 'An unexpected error occurred.');
             }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView style={stylesAdminUpload.safeArea}>
            <ScrollView>
                <View style={stylesAdminUpload.container}>
                    <Text style={stylesAdminUpload.title}>Upload Invoice (Admin)</Text>

                    {/* Button to trigger document picker */}
                    <TouchableOpacity
                        style={stylesAdminUpload.selectButton} onPress={pickDocument}
                        disabled={isUploading}>
                        <Text style={stylesAdminUpload.buttonText}>{selectedDocument ? 'Change PDF' : 'Select Invoice PDF'}</Text>
                    </TouchableOpacity>

                    {/* Display info about the selected document */}
                    {selectedDocument && (
                        <View style={stylesAdminUpload.fileInfoCard}>
                            <Text style={stylesAdminUpload.fileInfoTitle}>Selected File:</Text>
                            <Text style={stylesAdminUpload.fileInfoText} numberOfLines={1} ellipsizeMode="middle">{selectedDocument.name || 'Unknown File Name'}</Text>
                            {selectedDocument.size && (
                                <Text style={stylesAdminUpload.fileInfoSize}>
                                    Size: {(selectedDocument.size / 1024).toFixed(2)} KB
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Button to trigger the simulated upload */}
                    <TouchableOpacity
                        style={[
                            stylesAdminUpload.uploadButtonBase,
                            selectedDocument && !isUploading ? stylesAdminUpload.uploadButtonEnabled : stylesAdminUpload.uploadButtonDisabled
                        ]}
                        onPress={handleUpload}
                        disabled={!selectedDocument || isUploading}
                    >
                        {isUploading
                            ? <ActivityIndicator size="small" color={colors.white} />
                            : <Text style={stylesAdminUpload.buttonText}>Upload & Get Link </Text>
                        }
                    </TouchableOpacity>

                    {/* Display feedback messages */}
                    {uploadMessage ? (
                        <View style={stylesAdminUpload.messageBox}>
                            <Text style={stylesAdminUpload.messageText}
                                selectable={true}>{uploadMessage}</Text>
                            {uploadedUrl ? (
                                <TouchableOpacity
                                    style={stylesAdminUpload.viewButton}
                                    onPress={() => navigation.navigate('ViewDocument', { documentUrl: uploadedUrl })}
                                >
                                    <Text style={stylesAdminUpload.viewButtonText}>View Uploaded Document</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                       
                    ) : null}

                {/* Important note about the simulation */}
                <View style={stylesAdminUpload.noteBox}>
                    <Text style={stylesAdminUpload.noteTitle}>Important Note:</Text>
                    <Text style={stylesAdminUpload.noteText}>
                    This requires the Supabase bucket named 'pdf' to exist and allow public read access for the generated URL to work in the viewer. Alternatively, implement signed URLs for private buckets.
                    </Text>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView >
    );
};

// Styles specific to AdminUploadScreen
const stylesAdminUpload = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.gray100 },
    container: { padding: 24 },
    title: { fontSize: 30, fontWeight: '700', color: colors.gray800, marginBottom: 24 },
    selectButton: { backgroundColor: colors.accent, padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    fileInfoCard: { backgroundColor: colors.white, padding: 16, borderRadius: 8, marginBottom: 16, shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    fileInfoTitle: { fontSize: 16, color: colors.gray700, fontWeight: '500' },
    fileInfoText: { fontSize: 16, color: colors.gray600, marginTop: 4 },
    fileInfoSize: { fontSize: 14, color: colors.gray500, marginTop: 4 },
    uploadButtonBase: { padding: 16, borderRadius: 8, marginBottom: 16, alignItems: 'center', shadowColor: colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
    uploadButtonEnabled: { backgroundColor: colors.green500 },
    uploadButtonDisabled: { backgroundColor: colors.gray400 },
    buttonText: { fontSize: 18, fontWeight: '500', color: colors.white, textAlign: 'center' },
    messageBox: { marginTop: 16, padding: 12, backgroundColor: colors.yellow100, borderRadius: 8, borderWidth: 1, borderColor: colors.yellow300 },
    messageText: { fontSize: 14, color: colors.yellow800 },
    noteBox: { marginTop: 24, padding: 16, backgroundColor: colors.red100, borderRadius: 8, borderWidth: 1, borderColor: colors.red300 },
    noteTitle: { fontSize: 14, fontWeight: '600', color: colors.red800, marginBottom: 8 },
    noteText: { fontSize: 14, color: colors.red700 },
});

export default AdminUploadScreen;
