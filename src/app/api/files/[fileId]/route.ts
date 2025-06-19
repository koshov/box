import { auth0 } from "@/lib/auth0";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUrl } from "@/lib/uploadthing";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // Get the authenticated user from Auth0
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { fileId } = await params;
    
    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Verify the file belongs to the current user and get the file details
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', session.user.sub)
      .single();

    if (fetchError || !file) {
      return NextResponse.json(
        { error: "File not found or you don't have permission to access it" },
        { status: 404 }
      );
    }

    try {
      // Generate a signed URL that expires in 1 hour (3600 seconds)
      const presignedUrl = await generatePresignedUrl(file.file_url, 3600);

      return NextResponse.json({
        presignedUrl,
        expiresIn: 3600, // 1 hour in seconds
        fileName: file.file_name,
        fileSize: file.file_size,
        contentType: file.content_type
      });

    } catch (urlError) {
      console.error('Error generating presigned URL:', urlError);
      return NextResponse.json(
        { error: "Failed to generate file access URL" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in file access:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    // Get the authenticated user from Auth0
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { fileId } = await params;
    
    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // First, verify the file belongs to the current user and get the file details
    const { data: file, error: fetchError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', session.user.sub)
      .single();

    if (fetchError || !file) {
      return NextResponse.json(
        { error: "File not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Delete the file record from the database
    const { error: deleteError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', session.user.sub);

    if (deleteError) {
      console.error('Error deleting file from database:', deleteError);
      return NextResponse.json(
        { error: "Failed to delete file from database" },
        { status: 500 }
      );
    }

    // Note: You might also want to delete the actual file from UploadThing storage
    // This would require additional API calls to UploadThing's delete endpoint
    // For now, we're only removing the database record

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in file deletion:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
