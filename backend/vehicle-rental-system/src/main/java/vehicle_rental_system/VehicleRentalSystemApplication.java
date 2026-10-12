package vehicle_rental_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
public class VehicleRentalSystemApplication {

	public static void main(String[] args) {
		loadDotEnv();
		SpringApplication.run(VehicleRentalSystemApplication.class, args);
	}

	private static void loadDotEnv() {
		File[] candidateFiles = {
				new File(".env"),
				new File("../.env"),
				new File("backend/vehicle-rental-system/.env")
		};

		for (File file : candidateFiles) {
			if (file.exists() && file.isFile()) {
				try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
					String line;
					while ((line = reader.readLine()) != null) {
						line = line.trim();
						if (line.isEmpty() || line.startsWith("#")) {
							continue;
						}
						int eqIdx = line.indexOf('=');
						if (eqIdx > 0) {
							String key = line.substring(0, eqIdx).trim();
							String value = line.substring(eqIdx + 1).trim();
							if ((value.startsWith("\"") && value.endsWith("\""))
									|| (value.startsWith("'") && value.endsWith("'"))) {
								value = value.substring(1, value.length() - 1);
							}
							System.setProperty(key, value);
						}
					}
					System.out.println("Loaded environment variables from: " + file.getAbsolutePath());
				} catch (Exception e) {
					System.err.println("Notice: Could not load .env file: " + e.getMessage());
				}
				break;
			}
		}
	}

}

